// Entidad del dominio Reminder: aviso previo al vencimiento de una garantía.
// Calcula cuándo avisar; sin ella, los recordatorios podrían no coincidir con el vencimiento.

// El constructor privado dirige la creación a create() o restore() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { ConflictError } from '@/shared/domain/errors/domain.errors';
import {
  optionalText,
  requireIsoDate,
  requireNonNegativeInteger,
  requireOneOf,
  requireText,
  requireUuid,
} from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import { subtractDays, type IsoDate } from '@/shared/domain/value-objects/iso-date';

export const reminderStatuses = ['scheduled', 'sent', 'cancelled'] as const;
export type ReminderStatus = (typeof reminderStatuses)[number];

export interface CreateReminderData {
  warrantyId: string;
  offsetDays: number;
}

export interface CreateReminderProps extends CreateReminderData {
  id: string;
  warrantyEndDate: IsoDate; // de la garantía: solo se usa para calcular fireAt
  createdAt: IsoDate;
}

// Datos completos de un recordatorio que ya existe.
export interface RestoreReminderProps extends CreateReminderData {
  id: string;
  fireAt: IsoDate;
  notificationId?: string;
  status: ReminderStatus;
  createdAt: IsoDate;
}

export class Reminder {
  readonly id: string; // UUID
  readonly warrantyId: string;
  readonly offsetDays: number;
  readonly fireAt: IsoDate; // endDate - offsetDays
  readonly notificationId?: string; // id del NotificationScheduler para cancelar o reprogramar
  readonly status: ReminderStatus;
  readonly createdAt: IsoDate;

  private constructor(reminder: RestoreReminderProps) {
    this.id = reminder.id;
    this.warrantyId = reminder.warrantyId;
    this.offsetDays = reminder.offsetDays;
    this.fireAt = reminder.fireAt;
    this.notificationId = reminder.notificationId;
    this.status = reminder.status;
    this.createdAt = reminder.createdAt;

    Object.freeze(this);
  }

  static create(input: CreateReminderProps): Reminder {
    return Reminder.restore({
      id: input.id,
      warrantyId: input.warrantyId,
      offsetDays: input.offsetDays,
      fireAt: Reminder.calculateFireAt(input.warrantyEndDate, input.offsetDays),
      status: 'scheduled',
      createdAt: input.createdAt,
    });
  }

  static restore(input: RestoreReminderProps): Reminder {
    return new Reminder({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      warrantyId: requireUuid(input.warrantyId, 'La garantía debe ser un UUID válido.'),
      offsetDays: requireOffsetDays(input.offsetDays),
      fireAt: requireIsoDate(input.fireAt, 'La fecha del aviso no es válida.'),
      notificationId: optionalText(input.notificationId),
      status: requireOneOf(input.status, reminderStatuses, 'El estado del recordatorio no es válido.'),
      createdAt: requireIsoDate(input.createdAt, 'La fecha de creación no es válida.'),
    });
  }

  static calculateFireAt(warrantyEndDate: IsoDate, offsetDays: number): IsoDate {
    requireIsoDate(warrantyEndDate, 'La fecha de vencimiento no es válida.');
    return subtractDays(warrantyEndDate, requireOffsetDays(offsetDays));
  }

  // Al programar se omiten los avisos con fireAt pasado; los de hoy se conservan.
  static selectSchedulableOffsets(
    warrantyEndDate: IsoDate,
    offsetsDays: readonly number[],
    today: IsoDate,
  ): number[] {
    requireIsoDate(today, 'La fecha actual no es válida.');
    return offsetsDays.filter((days) => Reminder.calculateFireAt(warrantyEndDate, days) >= today);
  }

  assignNotification(notificationId: string): Reminder {
    this.assertScheduled();
    return Reminder.restore({
      ...this,
      notificationId: requireText(notificationId, 'El id de la notificación es obligatorio.'),
    });
  }

  markAsSent(): Reminder {
    this.assertScheduled();
    return Reminder.restore({ ...this, status: 'sent' });
  }

  cancel(): Reminder {
    this.assertScheduled();
    return Reminder.restore({ ...this, status: 'cancelled' });
  }

  static normalizeId(id: string): string {
    return normalizeUuid(id);
  }

  private assertScheduled(): void {
    if (this.status !== 'scheduled') {
      throw new ConflictError('Solo se puede modificar un recordatorio programado.');
    }
  }
}

function requireOffsetDays(value: number): number {
  return requireNonNegativeInteger(value, 'Los días de anticipación deben ser un entero mayor o igual a cero.');
}
