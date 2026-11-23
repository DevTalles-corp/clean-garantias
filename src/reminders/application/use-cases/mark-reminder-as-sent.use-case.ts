// Caso de uso de aplicación: marca como enviado un recordatorio programado.
// Evita repetir el aviso; sin él, seguiría pendiente.

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class MarkReminderAsSentUseCase {
  private readonly repository: ReminderRepository;

  constructor(repository: ReminderRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Reminder> {
    const current = await this.repository.findById(Reminder.normalizeId(id));
    if (!current) throw new NotFoundError('Recordatorio no encontrado.');

    const reminder = current.markAsSent();

    await this.repository.save(reminder);
    return reminder;
  }
}
