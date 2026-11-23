import type { SQLiteDatabase } from 'expo-sqlite';

import { Store } from '@/stores/domain/entities/store.entity';
import { SqliteStoreRepository } from '@/stores/infrastructure/repositories/sqlite.store-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

const store = Store.create({
  id: '00000002-0000-4000-8000-000000000000',
  name: 'Tienda',
  website: 'https://tienda.test',
  phone: '555',
  email: 'a@tienda.test',
  address: 'Calle 1',
  createdAt: '2026-01-01',
});

describe('SqliteStoreRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteStoreRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteStoreRepository(database);
  });

  test('devuelve undefined si no existe', async () => {
    expect(await repository.findById(store.id)).toBeUndefined();
  });

  test('guarda y recupera por id', async () => {
    await repository.save(store);
    expect({ ...(await repository.findById(store.id)) }).toEqual({ ...store });
  });

  test('reemplaza si el id ya existe', async () => {
    await repository.save(store);
    await repository.save(Store.create({ ...store, name: 'Nueva' }));

    expect((await repository.findById(store.id))?.name).toBe('Nueva');
    expect(await database.getAllAsync('SELECT * FROM stores')).toHaveLength(1);
  });

  test('borra solo el id indicado', async () => {
    const other = Store.create({ ...store, id: '00000032-0000-4000-8000-000000000000' });
    await repository.save(store);
    await repository.save(other);
    await repository.delete(store.id);

    expect(await repository.findById(store.id)).toBeUndefined();
    expect(await repository.findById(other.id)).toBeDefined();
  });

  test('findAll devuelve los resultados en orden', async () => {
    const first = Store.create({
      ...store,
      id: '00000032-0000-4000-8000-000000000000',
      name: 'abarrotes',
    });
    await repository.save(store);
    await repository.save(first);

    const found = await repository.findAll();
    expect(found.map(({ id }) => id)).toEqual([first.id, store.id]);
  });
});
