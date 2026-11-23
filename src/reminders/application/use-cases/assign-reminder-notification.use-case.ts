// Caso de uso de aplicación: asocia a un recordatorio el id de su notificación.
// Conserva el id para poder cancelarla; sin él, la notificación quedaría sin control.

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface AssignReminderNotificationDependencies {
  reminderRepository: ReminderRepository;
}

export class AssignReminderNotificationUseCase {
  private readonly reminderRepository: ReminderRepository;

  constructor({ reminderRepository }: AssignReminderNotificationDependencies) {
    this.reminderRepository = reminderRepository;
  }

  async execute(id: string, notificationId: string): Promise<Reminder> {
    const current = await this.reminderRepository.findById(Reminder.normalizeId(id));
    if (!current) throw new NotFoundError('Recordatorio no encontrado.');

    const reminder = current.assignNotification(notificationId);

    await this.reminderRepository.save(reminder);
    return reminder;
  }
}
