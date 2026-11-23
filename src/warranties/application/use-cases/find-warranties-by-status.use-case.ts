// Caso de uso de aplicación: obtiene las garantías no archivadas que hoy tienen un estado.
// Deriva el estado con la fecha y el umbral; sin él, cada pantalla lo calcularía distinto.

import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import { getWarrantyStatus, type Warranty, type WarrantyStatus } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class FindWarrantiesByStatusUseCase {
  private readonly warrantyRepository: WarrantyRepository;
  private readonly settingsRepository: SettingsRepository;
  private readonly clock: Clock;

  constructor(
    warrantyRepository: WarrantyRepository,
    settingsRepository: SettingsRepository,
    clock: Clock,
  ) {
    this.warrantyRepository = warrantyRepository;
    this.settingsRepository = settingsRepository;
    this.clock = clock;
  }

  async execute(status: WarrantyStatus): Promise<Warranty[]> {
    const settings = await this.settingsRepository.find();
    if (!settings) throw new NotFoundError('Configuración no encontrada.');

    const today = this.clock.today();
    const warranties = await this.warrantyRepository.findAll();

    return warranties.filter(
      (warranty) =>
        !warranty.isArchived &&
        getWarrantyStatus(warranty, today, settings.expiringThresholdDays) === status,
    );
  }
}
