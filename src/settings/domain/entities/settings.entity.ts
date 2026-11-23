// Entidad del dominio Settings: configuración única de la aplicación, sin id ni relaciones.
// Centraliza sus reglas; sin ella, recordatorios y estados usarían valores inválidos.

// El constructor privado dirige la creación a create() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { requireNonNegativeInteger, requireOneOf, requireText } from '@/shared/domain/validators/guards';
import { currencyCodes, type CurrencyCode } from '@/shared/domain/value-objects/currency-code';

export const themes = ['system', 'light', 'dark'] as const;
export type Theme = (typeof themes)[number];

export interface CreateSettingsData {
  currency: CurrencyCode;
  locale: string;
  reminderOffsetsDays: readonly number[]; // ej. [30, 7, 1]
  notificationsEnabled: boolean;
  theme: Theme;
  expiringThresholdDays: number; // ej. 30
}

export class Settings {
  readonly currency: CurrencyCode;
  readonly locale: string;
  readonly reminderOffsetsDays: readonly number[];
  readonly notificationsEnabled: boolean;
  readonly theme: Theme;
  readonly expiringThresholdDays: number;

  private constructor(settings: CreateSettingsData) {
    this.currency = settings.currency;
    this.locale = settings.locale;
    this.reminderOffsetsDays = settings.reminderOffsetsDays;
    this.notificationsEnabled = settings.notificationsEnabled;
    this.theme = settings.theme;
    this.expiringThresholdDays = settings.expiringThresholdDays;

    Object.freeze(this);
  }

  static create(input: CreateSettingsData): Settings {
    return new Settings({
      currency: requireOneOf(input.currency, currencyCodes, 'La moneda no es válida.'),
      locale: requireText(input.locale, 'El idioma es obligatorio.'),
      // Copia congelada: no comparte el arreglo recibido.
      reminderOffsetsDays: Object.freeze(
        input.reminderOffsetsDays.map((days) =>
          requireNonNegativeInteger(
            days,
            'Los días de anticipación deben ser enteros mayores o iguales a cero.',
          ),
        ),
      ),
      notificationsEnabled: input.notificationsEnabled,
      theme: requireOneOf(input.theme, themes, 'El tema no es válido.'),
      expiringThresholdDays: requireNonNegativeInteger(
        input.expiringThresholdDays,
        'El umbral debe ser un entero mayor o igual a cero.',
      ),
    });
  }

  update(changes: Partial<CreateSettingsData>): Settings {
    return Settings.create({ ...this, ...changes });
  }
}
