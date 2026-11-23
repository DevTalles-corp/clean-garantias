// Mapper ReminderMapper: convierte filas de SQLite en entidades Reminder y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import { Reminder, type ReminderStatus } from '@/reminders/domain/entities/reminder.entity';

// Fila de la tabla reminders. Es type y no interface para poder enviarse a upsertRow.
export type ReminderRow = {
  id: string;
  warranty_id: string;
  offset_days: number;
  fire_at: string;
  notification_id: string | null;
  status: string;
  created_at: string;
};

export class ReminderMapper {
  static toDomain(row: ReminderRow): Reminder {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Reminder.restore({
      id: row.id,
      warrantyId: row.warranty_id,
      offsetDays: row.offset_days,
      fireAt: row.fire_at,
      notificationId: row.notification_id ?? undefined,
      status: row.status as ReminderStatus,
      createdAt: row.created_at,
    });
  }

  static toRow(reminder: Reminder): ReminderRow {
    return {
      id: reminder.id,
      warranty_id: reminder.warrantyId,
      offset_days: reminder.offsetDays,
      fire_at: reminder.fireAt,
      notification_id: reminder.notificationId ?? null,
      status: reminder.status,
      created_at: reminder.createdAt,
    };
  }
}
