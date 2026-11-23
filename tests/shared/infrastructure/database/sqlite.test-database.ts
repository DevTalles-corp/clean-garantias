// Base de datos en memoria para pruebas: adapta node:sqlite a lo que usan los repositorios.
// Ejecuta SQL real sin el módulo nativo de Expo.

import type { SQLiteDatabase } from 'expo-sqlite';

import { migrateDatabase } from '@/shared/infrastructure/database/sqlite.migrations';

interface NodeStatement {
  all(...params: unknown[]): unknown[];
  get(...params: unknown[]): unknown;
  run(...params: unknown[]): unknown;
}
interface NodeDatabase {
  exec(sql: string): void;
  prepare(sql: string): NodeStatement;
}

export function createEmptyDatabase(): SQLiteDatabase {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require('node:sqlite') as {
    DatabaseSync: new (path: string, options: object) => NodeDatabase;
  };
  // Apagadas como en SQLite por defecto: deben activarse al migrar.
  const database = new DatabaseSync(':memory:', { enableForeignKeyConstraints: false });

  const adapter = {
    execAsync: async (sql: string) => database.exec(sql),
    getFirstAsync: async (sql: string, params: unknown[] = []) =>
      database.prepare(sql).get(...params) ?? null,
    getAllAsync: async (sql: string, params: unknown[] = []) =>
      database.prepare(sql).all(...params),
    runAsync: async (sql: string, params: unknown[] = []) => database.prepare(sql).run(...params),
    withTransactionAsync: async (task: () => Promise<void>) => {
      database.exec('BEGIN');
      try {
        await task();
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
    },
  };

  return adapter as unknown as SQLiteDatabase;
}

export async function createTestDatabase(): Promise<SQLiteDatabase> {
  const database = createEmptyDatabase();
  await migrateDatabase(database);
  return database;
}
