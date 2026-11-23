// Implementación SqliteStoreRepository: guarda y consulta las tiendas en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Store } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';
import { StoreMapper, type StoreRow } from '@/stores/infrastructure/mappers/store.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteStoreRepository implements StoreRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Store | undefined> {
    const row = await this.database.getFirstAsync<StoreRow>('SELECT * FROM stores WHERE id = ?', [
      id,
    ]);
    return row ? StoreMapper.toDomain(row) : undefined;
  }

  async findAll(): Promise<Store[]> {
    const rows = await this.database.getAllAsync<StoreRow>(
      'SELECT * FROM stores ORDER BY name COLLATE NOCASE, id',
    );
    return rows.map(StoreMapper.toDomain);
  }

  async save(store: Store): Promise<void> {
    await upsertRow(this.database, 'stores', StoreMapper.toRow(store));
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM stores WHERE id = ?', [id]);
  }
}
