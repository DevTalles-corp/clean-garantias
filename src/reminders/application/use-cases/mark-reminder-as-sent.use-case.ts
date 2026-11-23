// Caso de uso de aplicación: marca como enviado un recordatorio programado.
// Evita repetir el aviso; sin él, seguiría pendiente.

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface MarkReminderAsSentDependencies {
  reminderRepository: ReminderRepository;
}

export class MarkReminderAsSentUseCase {
  private readonly reminderRepository: ReminderRepository;

  constructor({ reminderRepository }: MarkReminderAsSentDependencies) {
    this.reminderRepository = reminderRepository;
  }

  async execute(id: string): Promise<Reminder> {
    const current = await this.reminderRepository.findById(Reminder.normalizeId(id));
    if (!current) throw new NotFoundError('Recordatorio no encontrado.');

    const reminder = current.markAsSent();

    await this.reminderRepository.save(reminder);
    return reminder;
  }
}
