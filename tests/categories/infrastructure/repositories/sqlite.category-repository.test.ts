import type { SQLiteDatabase } from 'expo-sqlite';

import { Category } from '@/categories/domain/entities/category.entity';
import { SqliteCategoryRepository } from '@/categories/infrastructure/repositories/sqlite.category-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

const category = Category.create({
  id: '00000001-0000-4000-8000-000000000000',
  name: 'Cómputo',
  icon: 'laptopcomputer',
  color: '#208AEF',
  defaultWarrantyMonths: 12,
  isSystem: true,
  createdAt: '2026-01-01',
});

describe('SqliteCategoryRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteCategoryRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteCategoryRepository(database);
  });

  test('devuelve undefined si no existe', async () => {
    expect(await repository.findById(category.id)).toBeUndefined();
  });

  test('guarda y recupera por id', async () => {
    await repository.save(category);
    expect({ ...(await repository.findById(category.id)) }).toEqual({ ...category });
  });

  test('reemplaza si el id ya existe', async () => {
    await repository.save(category);
    await repository.save(Category.create({ ...category, name: 'Nueva' }));

    expect((await repository.findById(category.id))?.name).toBe('Nueva');
    expect(await database.getAllAsync('SELECT * FROM categories')).toHaveLength(1);
  });

  test('borra solo el id indicado', async () => {
    const other = Category.create({ ...category, id: '00000032-0000-4000-8000-000000000000' });
    await repository.save(category);
    await repository.save(other);
    await repository.delete(category.id);

    expect(await repository.findById(category.id)).toBeUndefined();
    expect(await repository.findById(other.id)).toBeDefined();
  });

  test('findAll devuelve los resultados en orden', async () => {
    const first = Category.create({
      ...category,
      id: '00000032-0000-4000-8000-000000000000',
      name: 'audio',
    });
    await repository.save(category);
    await repository.save(first);

    const found = await repository.findAll();
    expect(found.map(({ id }) => id)).toEqual([first.id, category.id]);
  });
});
