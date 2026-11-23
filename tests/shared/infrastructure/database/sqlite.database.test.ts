import { openDatabaseAsync } from 'expo-sqlite';

import { openSqliteDatabase } from '@/shared/infrastructure/database/sqlite.database';

import { createEmptyDatabase } from './sqlite.test-database';

jest.mock('expo-sqlite', () => ({ openDatabaseAsync: jest.fn() }));

describe('openSqliteDatabase', () => {
  test('devuelve la base de datos migrada', async () => {
    const database = createEmptyDatabase();
    jest.mocked(openDatabaseAsync).mockResolvedValue(database);

    expect(await openSqliteDatabase()).toBe(database);
    expect(await database.getAllAsync('SELECT * FROM products')).toEqual([]);
  });

  test('cierra la base de datos si falla la migración', async () => {
    const closeAsync = jest.fn();
    const database = { execAsync: jest.fn().mockRejectedValue(new Error('fallo')), closeAsync };
    jest.mocked(openDatabaseAsync).mockResolvedValue(database as never);

    await expect(openSqliteDatabase()).rejects.toThrow('fallo');
    expect(closeAsync).toHaveBeenCalledTimes(1);
  });
});
