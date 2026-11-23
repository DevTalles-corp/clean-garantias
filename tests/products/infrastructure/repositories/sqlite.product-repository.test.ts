import type { SQLiteDatabase } from 'expo-sqlite';

import { Category } from '@/categories/domain/entities/category.entity';
import { SqliteCategoryRepository } from '@/categories/infrastructure/repositories/sqlite.category-repository';
import { Store } from '@/stores/domain/entities/store.entity';
import { SqliteStoreRepository } from '@/stores/infrastructure/repositories/sqlite.store-repository';
import { Product } from '@/products/domain/entities/product.entity';
import { SqliteProductRepository } from '@/products/infrastructure/repositories/sqlite.product-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

const product = Product.restore({
  id: '00000003-0000-4000-8000-000000000000',
  name: 'Laptop',
  brand: 'Acme',
  model: 'X1',
  serialNumber: 'SN',
  categoryId: '00000001-0000-4000-8000-000000000000',
  storeId: '00000002-0000-4000-8000-000000000000',
  purchaseDate: '2026-01-10',
  purchasePrice: { amountCents: 0, currency: 'USD' },
  imageUri: 'file:///a.png',
  notes: 'Nota',
  createdAt: '2026-01-15',
  updatedAt: '2026-02-01',
});

describe('SqliteProductRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteProductRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteProductRepository(database);
    await new SqliteCategoryRepository(database).save(
      Category.create({
        id: '00000001-0000-4000-8000-000000000000',
        name: 'Cómputo',
        icon: 'laptopcomputer',
        color: '#208AEF',
        defaultWarrantyMonths: 12,
        isSystem: true,
        createdAt: '2026-01-01',
      }),
    );
    await new SqliteStoreRepository(database).save(
      Store.create({
        id: '00000002-0000-4000-8000-000000000000',
        name: 'Tienda',
        website: 'https://tienda.test',
        phone: '555',
        email: 'a@tienda.test',
        address: 'Calle 1',
        createdAt: '2026-01-01',
      }),
    );
  });

  test('devuelve undefined si no existe', async () => {
    expect(await repository.findById(product.id)).toBeUndefined();
  });

  test('guarda y recupera por id', async () => {
    await repository.save(product);
    expect({ ...(await repository.findById(product.id)) }).toEqual({ ...product });
  });

  test('reemplaza si el id ya existe', async () => {
    await repository.save(product);
    await repository.save(Product.restore({ ...product, name: 'Nuevo' }));

    expect((await repository.findById(product.id))?.name).toBe('Nuevo');
    expect(await database.getAllAsync('SELECT * FROM products')).toHaveLength(1);
  });

  test('borra solo el id indicado', async () => {
    const other = Product.restore({ ...product, id: '00000032-0000-4000-8000-000000000000' });
    await repository.save(product);
    await repository.save(other);
    await repository.delete(product.id);

    expect(await repository.findById(product.id)).toBeUndefined();
    expect(await repository.findById(other.id)).toBeDefined();
  });

  test('findAll devuelve los resultados en orden', async () => {
    const first = Product.restore({
      ...product,
      id: '00000032-0000-4000-8000-000000000000',
      purchaseDate: '2026-05-01',
    });
    await repository.save(product);
    await repository.save(first);

    const found = await repository.findAll();
    expect(found.map(({ id }) => id)).toEqual([first.id, product.id]);
  });

  test('findByCategoryId devuelve los resultados en orden', async () => {
    const first = Product.restore({
      ...product,
      id: '00000032-0000-4000-8000-000000000000',
      purchaseDate: '2026-05-01',
    });
    await repository.save(product);
    await repository.save(first);

    const found = await repository.findByCategoryId('00000001-0000-4000-8000-000000000000');
    expect(found.map(({ id }) => id)).toEqual([first.id, product.id]);
    expect(await repository.findByCategoryId('00000063-0000-4000-8000-000000000000')).toEqual([]);
  });

  test('findByStoreId devuelve los resultados en orden', async () => {
    const first = Product.restore({
      ...product,
      id: '00000032-0000-4000-8000-000000000000',
      purchaseDate: '2026-05-01',
    });
    await repository.save(product);
    await repository.save(first);

    const found = await repository.findByStoreId('00000002-0000-4000-8000-000000000000');
    expect(found.map(({ id }) => id)).toEqual([first.id, product.id]);
    expect(await repository.findByStoreId('00000063-0000-4000-8000-000000000000')).toEqual([]);
  });

  test('rechaza una referencia inexistente', async () => {
    const orphan = Product.restore({
      ...product,
      categoryId: '00000063-0000-4000-8000-000000000000',
    });
    await expect(repository.save(orphan)).rejects.toThrow(/FOREIGN KEY/);
  });

  test('permite actualizar una categoría en uso, pero no borrarla', async () => {
    const categories = new SqliteCategoryRepository(database);
    await repository.save(product);
    const category = await categories.findById(product.categoryId);

    await categories.save(Category.create({ ...category!, name: 'Nueva' }));
    expect(await repository.findById(product.id)).toBeDefined();
    await expect(categories.delete(product.categoryId)).rejects.toThrow(/FOREIGN KEY/);
  });
});
