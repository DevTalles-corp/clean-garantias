// Implementación SqliteWarrantyRepository: guarda y consulta las garantías en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';
import type { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';
import {
  WarrantyMapper,
  type WarrantyRow,
} from '@/warranties/infrastructure/mappers/warranty.mapper';

export class SqliteWarrantyRepository implements WarrantyRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Warranty | undefined> {
    const row = await this.database.getFirstAsync<WarrantyRow>(
      'SELECT * FROM warranties WHERE id = ?',
      [id]
    );
    return row ? WarrantyMapper.toDomain(row) : undefined;
  }

  async findAll(): Promise<Warranty[]> {
    const rows = await this.database.getAllAsync<WarrantyRow>(
      'SELECT * FROM warranties ORDER BY start_date DESC, id'
    );
    return rows.map(WarrantyMapper.toDomain);
  }

  async findByProductId(productId: string): Promise<Warranty[]> {
    const rows = await this.database.getAllAsync<WarrantyRow>(
      'SELECT * FROM warranties WHERE product_id = ? ORDER BY start_date DESC, id',
      [productId]
    );
    return rows.map(WarrantyMapper.toDomain);
  }

  async save(warranty: Warranty): Promise<void> {
    await upsertRow(
      this.database,
      'warranties',
      WarrantyMapper.toRow(warranty)
    );
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM warranties WHERE id = ?', [id]);
  }
}
