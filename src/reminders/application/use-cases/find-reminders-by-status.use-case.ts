// Caso de uso de aplicación: obtiene los recordatorios que tienen un estado.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Reminder, ReminderStatus } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';

export interface FindRemindersByStatusDependencies {
  reminderRepository: ReminderRepository;
}

export class FindRemindersByStatusUseCase {
  private readonly reminderRepository: ReminderRepository;

  constructor({ reminderRepository }: FindRemindersByStatusDependencies) {
    this.reminderRepository = reminderRepository;
  }

  async execute(status: ReminderStatus): Promise<Reminder[]> {
    return this.reminderRepository.findByStatus(status);
  }
}
