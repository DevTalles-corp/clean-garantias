// Implementación SqliteSettingsRepository: guarda y consulta la configuración en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Settings } from '@/settings/domain/entities/settings.entity';
import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';
import {
  SettingsMapper,
  type SettingsRow,
  settingsRowId,
} from '@/settings/infrastructure/mappers/settings.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteSettingsRepository implements SettingsRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async find(): Promise<Settings | undefined> {
    const row = await this.database.getFirstAsync<SettingsRow>(
      'SELECT * FROM settings WHERE id = ?',
      [settingsRowId],
    );
    return row ? SettingsMapper.toDomain(row) : undefined;
  }

  async save(settings: Settings): Promise<void> {
    await upsertRow(this.database, 'settings', SettingsMapper.toRow(settings));
  }
}
