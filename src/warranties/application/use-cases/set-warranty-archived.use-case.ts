// Caso de uso de aplicación: archiva o recupera una garantía y ajusta sus recordatorios.
// Une ambos cambios; sin él, una garantía archivada seguiría generando avisos.

import type { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class SetWarrantyArchivedUseCase {
  private readonly repository: WarrantyRepository;
  private readonly scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase;
  private readonly clock: Clock;

  constructor(
    repository: WarrantyRepository,
    scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase,
    clock: Clock,
  ) {
    this.repository = repository;
    this.scheduleWarrantyReminders = scheduleWarrantyReminders;
    this.clock = clock;
  }

  async execute(id: string, isArchived: boolean): Promise<Warranty> {
    const current = await this.repository.findById(Warranty.normalizeId(id));
    if (!current) throw new NotFoundError('Garantía no encontrada.');

    const warranty = current.setArchived(isArchived, this.clock.today());

    await this.repository.save(warranty);
    await this.scheduleWarrantyReminders.execute(warranty.id);
    return warranty;
  }
}
