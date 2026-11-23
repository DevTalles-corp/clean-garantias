// Caso de uso de aplicación: asocia a un recordatorio el id de su notificación.
// Conserva el id para poder cancelarla; sin él, la notificación quedaría sin control.

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class AssignReminderNotificationUseCase {
  private readonly repository: ReminderRepository;

  constructor(repository: ReminderRepository) {
    this.repository = repository;
  }

  async execute(id: string, notificationId: string): Promise<Reminder> {
    const current = await this.repository.findById(Reminder.normalizeId(id));
    if (!current) throw new NotFoundError('Recordatorio no encontrado.');

    const reminder = current.assignNotification(notificationId);

    await this.repository.save(reminder);
    return reminder;
  }
}
