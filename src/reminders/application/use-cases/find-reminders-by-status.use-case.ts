// Caso de uso de aplicación: obtiene los recordatorios que tienen un estado.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Reminder, ReminderStatus } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';

export class FindRemindersByStatusUseCase {
  private readonly repository: ReminderRepository;

  constructor(repository: ReminderRepository) {
    this.repository = repository;
  }

  async execute(status: ReminderStatus): Promise<Reminder[]> {
    return this.repository.findByStatus(status);
  }
}
