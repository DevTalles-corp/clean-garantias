// Infraestructura: abre la base de datos SQLite lista para usarse.
// Se debe llamar una sola vez, desde el punto de composición.

import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from '@/shared/infrastructure/database/sqlite.migrations';

const databaseName = 'mis-garantias.db';

export async function openSqliteDatabase(): Promise<SQLiteDatabase> {
  const database = await openDatabaseAsync(databaseName);

  try {
    await migrateDatabase(database);
    return database;
  } catch (error) {
    await database.closeAsync();
    throw error;
  }
}
