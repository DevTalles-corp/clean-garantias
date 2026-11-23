// Caso de uso de aplicación: cancela un recordatorio programado.
// Conserva su historial; sin él, habría que borrarlo.

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface CancelReminderDependencies {
  reminderRepository: ReminderRepository;
}

export class CancelReminderUseCase {
  private readonly reminderRepository: ReminderRepository;

  constructor({ reminderRepository }: CancelReminderDependencies) {
    this.reminderRepository = reminderRepository;
  }

  async execute(id: string): Promise<Reminder> {
    const current = await this.reminderRepository.findById(Reminder.normalizeId(id));
    if (!current) throw new NotFoundError('Recordatorio no encontrado.');

    const reminder = current.cancel();

    await this.reminderRepository.save(reminder);
    return reminder;
  }
}
