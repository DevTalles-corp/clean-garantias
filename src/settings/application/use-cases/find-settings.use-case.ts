// Caso de uso de aplicación: obtiene la configuración y avisa si aún no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer sin configuración.

import type { Settings } from '@/settings/domain/entities/settings.entity';
import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class FindSettingsUseCase {
  private readonly repository: SettingsRepository;

  constructor(repository: SettingsRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Settings> {
    const settings = await this.repository.find();
    if (!settings) throw new NotFoundError('Configuración no encontrada.');
    return settings;
  }
}
