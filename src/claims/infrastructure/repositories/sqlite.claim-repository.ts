// Implementación SqliteClaimRepository: guarda y consulta los reclamos en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Claim } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { ClaimMapper, type ClaimRow } from '@/claims/infrastructure/mappers/claim.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteClaimRepository implements ClaimRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Claim | undefined> {
    const row = await this.database.getFirstAsync<ClaimRow>('SELECT * FROM claims WHERE id = ?', [
      id,
    ]);
    return row ? ClaimMapper.toDomain(row) : undefined;
  }

  async findByWarrantyId(warrantyId: string): Promise<Claim[]> {
    const rows = await this.database.getAllAsync<ClaimRow>(
      'SELECT * FROM claims WHERE warranty_id = ? ORDER BY opened_at DESC, id',
      [warrantyId],
    );
    return rows.map(ClaimMapper.toDomain);
  }

  async save(claim: Claim): Promise<void> {
    await upsertRow(this.database, 'claims', ClaimMapper.toRow(claim));
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM claims WHERE id = ?', [id]);
  }
}
