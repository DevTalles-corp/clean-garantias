// Contrato del dominio SettingsRepository: define cómo consultar y guardar la configuración sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.
// La configuración es única: no tiene id, no se lista ni se borra.

import type { Settings } from '@/settings/domain/entities/settings.entity';

export interface SettingsRepository {
  find(): Promise<Settings | undefined>; // undefined si aún no se ha guardado
  save(settings: Settings): Promise<void>; // crea o reemplaza la única configuración
}
