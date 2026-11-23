// Caso de uso de aplicación: guarda la configuración inicial solo si aún no existe.
// Permite ejecutarlo en cada arranque; sin él, se perderían las preferencias guardadas.

import { Settings, type CreateSettingsData } from '@/settings/domain/entities/settings.entity';
import type { SettingsRepository } from '@/settings/domain/repositories/settings.repository';

export class InitializeSettingsUseCase {
  private readonly repository: SettingsRepository;

  constructor(repository: SettingsRepository) {
    this.repository = repository;
  }

  async execute(defaults: CreateSettingsData): Promise<Settings> {
    const current = await this.repository.find();
    if (current) return current;

    const settings = Settings.create(defaults);
    await this.repository.save(settings);
    return settings;
  }
}
