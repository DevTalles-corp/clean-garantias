// Caso de uso de aplicación: obtiene los recordatorios de una garantía.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';

export interface FindRemindersByWarrantyDependencies {
  reminderRepository: ReminderRepository;
}

export class FindRemindersByWarrantyUseCase {
  private readonly reminderRepository: ReminderRepository;

  constructor({ reminderRepository }: FindRemindersByWarrantyDependencies) {
    this.reminderRepository = reminderRepository;
  }

  async execute(warrantyId: string): Promise<Reminder[]> {
    return this.reminderRepository.findByWarrantyId(Warranty.normalizeId(warrantyId));
  }
}
