// Caso de uso de aplicación: obtiene los recordatorios de una garantía.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';

export class FindRemindersByWarrantyUseCase {
  private readonly repository: ReminderRepository;

  constructor(repository: ReminderRepository) {
    this.repository = repository;
  }

  async execute(warrantyId: string): Promise<Reminder[]> {
    return this.repository.findByWarrantyId(Warranty.normalizeId(warrantyId));
  }
}
