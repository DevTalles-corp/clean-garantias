import type { SQLiteDatabase } from 'expo-sqlite';

import { Category } from '@/categories/domain/entities/category.entity';
import { SqliteCategoryRepository } from '@/categories/infrastructure/repositories/sqlite.category-repository';
import { Store } from '@/stores/domain/entities/store.entity';
import { SqliteStoreRepository } from '@/stores/infrastructure/repositories/sqlite.store-repository';
import { Product } from '@/products/domain/entities/product.entity';
import { SqliteProductRepository } from '@/products/infrastructure/repositories/sqlite.product-repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import { SqliteWarrantyRepository } from '@/warranties/infrastructure/repositories/sqlite.warranty-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

const warranty = Warranty.restore({
  id: '00000004-0000-4000-8000-000000000000',
  productId: '00000003-0000-4000-8000-000000000000',
  type: 'extended',
  provider: 'Acme',
  startDate: '2026-01-10',
  durationMonths: 24,
  policyNumber: 'P-1',
  coverage: 'Total',
  contactPhone: '555',
  contactEmail: 'a@acme.test',
  isArchived: true,
  createdAt: '2026-01-15',
  updatedAt: '2026-02-01',
});

describe('SqliteWarrantyRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteWarrantyRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteWarrantyRepository(database);
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
    await new SqliteProductRepository(database).save(
      Product.restore({
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
      }),
    );
  });

  test('devuelve undefined si no existe', async () => {
    expect(await repository.findById(warranty.id)).toBeUndefined();
  });

  test('guarda y recupera por id', async () => {
    await repository.save(warranty);
    expect({ ...(await repository.findById(warranty.id)) }).toEqual({ ...warranty });
  });

  test('reemplaza si el id ya existe', async () => {
    await repository.save(warranty);
    await repository.save(Warranty.restore({ ...warranty, provider: 'Otro' }));

    expect((await repository.findById(warranty.id))?.provider).toBe('Otro');
    expect(await database.getAllAsync('SELECT * FROM warranties')).toHaveLength(1);
  });

  test('borra solo el id indicado', async () => {
    const other = Warranty.restore({ ...warranty, id: '00000032-0000-4000-8000-000000000000' });
    await repository.save(warranty);
    await repository.save(other);
    await repository.delete(warranty.id);

    expect(await repository.findById(warranty.id)).toBeUndefined();
    expect(await repository.findById(other.id)).toBeDefined();
  });

  test('findAll devuelve los resultados en orden', async () => {
    const first = Warranty.restore({
      ...warranty,
      id: '00000032-0000-4000-8000-000000000000',
      startDate: '2026-05-01',
    });
    await repository.save(warranty);
    await repository.save(first);

    const found = await repository.findAll();
    expect(found.map(({ id }) => id)).toEqual([first.id, warranty.id]);
  });

  test('findByProductId devuelve los resultados en orden', async () => {
    const first = Warranty.restore({
      ...warranty,
      id: '00000032-0000-4000-8000-000000000000',
      startDate: '2026-05-01',
    });
    await repository.save(warranty);
    await repository.save(first);

    const found = await repository.findByProductId('00000003-0000-4000-8000-000000000000');
    expect(found.map(({ id }) => id)).toEqual([first.id, warranty.id]);
    expect(await repository.findByProductId('00000063-0000-4000-8000-000000000000')).toEqual([]);
  });

  test('rechaza una referencia inexistente', async () => {
    const orphan = Warranty.restore({
      ...warranty,
      productId: '00000063-0000-4000-8000-000000000000',
    });
    await expect(repository.save(orphan)).rejects.toThrow(/FOREIGN KEY/);
  });
});
