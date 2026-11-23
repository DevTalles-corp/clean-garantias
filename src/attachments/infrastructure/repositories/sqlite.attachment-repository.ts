// Implementación SqliteAttachmentRepository: guarda y consulta los adjuntos en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Attachment, AttachmentOwner } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import {
  AttachmentMapper,
  type AttachmentRow,
} from '@/attachments/infrastructure/mappers/attachment.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteAttachmentRepository implements AttachmentRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Attachment | undefined> {
    const row = await this.database.getFirstAsync<AttachmentRow>(
      'SELECT * FROM attachments WHERE id = ?',
      [id],
    );
    return row ? AttachmentMapper.toDomain(row) : undefined;
  }

  async findByOwner(ownerType: AttachmentOwner, ownerId: string): Promise<Attachment[]> {
    const rows = await this.database.getAllAsync<AttachmentRow>(
      'SELECT * FROM attachments WHERE owner_type = ? AND owner_id = ? ORDER BY created_at, id',
      [ownerType, ownerId],
    );
    return rows.map(AttachmentMapper.toDomain);
  }

  async save(attachment: Attachment): Promise<void> {
    await upsertRow(this.database, 'attachments', AttachmentMapper.toRow(attachment));
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM attachments WHERE id = ?', [id]);
  }
}
