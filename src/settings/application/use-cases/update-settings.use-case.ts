// Caso de uso de aplicación: actualiza la configuración y reprograma los recordatorios si hace falta.
// Aplica las preferencias a las garantías existentes; sin él, conservarían avisos que el usuario ya no quiere.

import type { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import type { CreateSettingsData, Settings } from '@/settings/domain/entities/settings.entity';
import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class UpdateSettingsUseCase {
  private readonly settingsRepository: SettingsRepository;
  private readonly warrantyRepository: WarrantyRepository;
  private readonly scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase;

  constructor(
    settingsRepository: SettingsRepository,
    warrantyRepository: WarrantyRepository,
    scheduleWarrantyReminders: ScheduleWarrantyRemindersUseCase,
  ) {
    this.settingsRepository = settingsRepository;
    this.warrantyRepository = warrantyRepository;
    this.scheduleWarrantyReminders = scheduleWarrantyReminders;
  }

  async execute(changes: Partial<CreateSettingsData>): Promise<Settings> {
    const current = await this.settingsRepository.find();
    if (!current) throw new NotFoundError('Configuración no encontrada.');

    const settings = current.update(changes);
    await this.settingsRepository.save(settings);

    if (this.changesReminders(current, settings)) {
      for (const warranty of await this.warrantyRepository.findAll()) {
        await this.scheduleWarrantyReminders.execute(warranty.id);
      }
    }
    return settings;
  }

  private changesReminders(current: Settings, next: Settings): boolean {
    return (
      current.notificationsEnabled !== next.notificationsEnabled ||
      current.reminderOffsetsDays.join() !== next.reminderOffsetsDays.join()
    );
  }
}
