// Mapper SettingsMapper: convierte filas de SQLite en entidades Settings y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import { Settings, type Theme } from '@/settings/domain/entities/settings.entity';
import type { CurrencyCode } from '@/shared/domain/value-objects/currency-code';

// La configuración es única: siempre ocupa la misma fila.
export const settingsRowId = 1;

// Fila de la tabla settings. Es type y no interface para poder enviarse a upsertRow.
export type SettingsRow = {
  id: number;
  currency: string;
  locale: string;
  reminder_offsets_days: string; // arreglo JSON
  notifications_enabled: number; // 0 o 1
  theme: string;
  expiring_threshold_days: number;
};

export class SettingsMapper {
  static toDomain(row: SettingsRow): Settings {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Settings.create({
      currency: row.currency as CurrencyCode,
      locale: row.locale,
      reminderOffsetsDays: JSON.parse(row.reminder_offsets_days) as number[],
      notificationsEnabled: row.notifications_enabled === 1,
      theme: row.theme as Theme,
      expiringThresholdDays: row.expiring_threshold_days,
    });
  }

  static toRow(settings: Settings): SettingsRow {
    return {
      id: settingsRowId,
      currency: settings.currency,
      locale: settings.locale,
      reminder_offsets_days: JSON.stringify(settings.reminderOffsetsDays),
      notifications_enabled: settings.notificationsEnabled ? 1 : 0,
      theme: settings.theme,
      expiring_threshold_days: settings.expiringThresholdDays,
    };
  }
}
