// Caso de uso de aplicación: ajusta los recordatorios de una garantía a su vencimiento y a la configuración.
// Conserva los vigentes, cancela los sobrantes y crea los que faltan; sin él, habría avisos duplicados u obsoletos.

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export interface ScheduleWarrantyRemindersDependencies {
  reminderRepository: ReminderRepository;
  warrantyRepository: WarrantyRepository;
  settingsRepository: SettingsRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export class ScheduleWarrantyRemindersUseCase {
  private readonly reminderRepository: ReminderRepository;
  private readonly warrantyRepository: WarrantyRepository;
  private readonly settingsRepository: SettingsRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor({
    reminderRepository,
    warrantyRepository,
    settingsRepository,
    idGenerator,
    clock,
  }: ScheduleWarrantyRemindersDependencies) {
    this.reminderRepository = reminderRepository;
    this.warrantyRepository = warrantyRepository;
    this.settingsRepository = settingsRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(warrantyId: string): Promise<Reminder[]> {
    const warranty = await this.warrantyRepository.findById(Warranty.normalizeId(warrantyId));
    if (!warranty) throw new NotFoundError('Garantía no encontrada.');

    const today = this.clock.today();
    const offsets = await this.findOffsets(warranty, today);
    const reminders = await this.reminderRepository.findByWarrantyId(warranty.id);
    const current = reminders.filter((reminder) => reminder.status !== 'cancelled');
    const matches = (reminder: Reminder, offsetDays: number) =>
      reminder.offsetDays === offsetDays &&
      reminder.fireAt === Reminder.calculateFireAt(warranty.endDate, offsetDays);

    for (const reminder of current) {
      // Un aviso ya vencido pudo enviarse: se deja para que pueda marcarse como enviado.
      if (reminder.status !== 'scheduled' || reminder.fireAt < today) continue;
      if (offsets.some((offsetDays) => matches(reminder, offsetDays))) continue;
      await this.reminderRepository.save(reminder.cancel());
    }

    for (const offsetDays of offsets) {
      // Un aviso ya programado o enviado para esa fecha no se repite.
      if (current.some((reminder) => matches(reminder, offsetDays))) continue;
      await this.reminderRepository.save(
        Reminder.create({
          id: this.idGenerator.generate(),
          warrantyId: warranty.id,
          offsetDays,
          warrantyEndDate: warranty.endDate,
          createdAt: today,
        }),
      );
    }

    const updated = await this.reminderRepository.findByWarrantyId(warranty.id);
    return updated.filter((reminder) => reminder.status === 'scheduled');
  }

  // Sin configuración, con avisos apagados o con la garantía archivada no se programa nada.
  private async findOffsets(warranty: Warranty, today: IsoDate): Promise<number[]> {
    const settings = await this.settingsRepository.find();
    if (!settings?.notificationsEnabled || warranty.isArchived) return [];

    return Reminder.selectSchedulableOffsets(
      warranty.endDate,
      [...new Set(settings.reminderOffsetsDays)],
      today,
    );
  }
}
