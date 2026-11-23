// Implementación SqliteReminderRepository: guarda y consulta los recordatorios en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Reminder, ReminderStatus } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import {
  ReminderMapper,
  type ReminderRow,
} from '@/reminders/infrastructure/mappers/reminder.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteReminderRepository implements ReminderRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Reminder | undefined> {
    const row = await this.database.getFirstAsync<ReminderRow>(
      'SELECT * FROM reminders WHERE id = ?',
      [id],
    );
    return row ? ReminderMapper.toDomain(row) : undefined;
  }

  async findByWarrantyId(warrantyId: string): Promise<Reminder[]> {
    const rows = await this.database.getAllAsync<ReminderRow>(
      'SELECT * FROM reminders WHERE warranty_id = ? ORDER BY fire_at, id',
      [warrantyId],
    );
    return rows.map(ReminderMapper.toDomain);
  }

  async findByStatus(status: ReminderStatus): Promise<Reminder[]> {
    const rows = await this.database.getAllAsync<ReminderRow>(
      'SELECT * FROM reminders WHERE status = ? ORDER BY fire_at, id',
      [status],
    );
    return rows.map(ReminderMapper.toDomain);
  }

  async save(reminder: Reminder): Promise<void> {
    await upsertRow(this.database, 'reminders', ReminderMapper.toRow(reminder));
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
  }
}
