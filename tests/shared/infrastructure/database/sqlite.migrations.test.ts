import { migrateDatabase } from '@/shared/infrastructure/database/sqlite.migrations';

import { createEmptyDatabase } from './sqlite.test-database';

describe('migrateDatabase', () => {
  test('crea las tablas y registra la versión', async () => {
    const database = createEmptyDatabase();
    await migrateDatabase(database);

    const tables = await database.getAllAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    );
    const version = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

    expect(tables.map(({ name }) => name)).toEqual([
      'attachments',
      'categories',
      'claims',
      'products',
      'reminders',
      'settings',
      'stores',
      'warranties',
    ]);
    expect(version?.user_version).toBe(1);
  });

  test('no repite migraciones ya aplicadas', async () => {
    const database = createEmptyDatabase();
    await migrateDatabase(database);

    await expect(migrateDatabase(database)).resolves.toBeUndefined();
  });

  test('activa las llaves foráneas', async () => {
    const database = createEmptyDatabase();
    await migrateDatabase(database);

    const result = await database.getFirstAsync<{ foreign_keys: number }>('PRAGMA foreign_keys');
    expect(result?.foreign_keys).toBe(1);
  });
});
