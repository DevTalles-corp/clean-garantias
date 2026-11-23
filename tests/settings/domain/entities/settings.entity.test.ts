import { Settings, themes, type CreateSettingsData } from '@/settings/domain/entities/settings.entity';
import { currencyCodes } from '@/shared/domain/value-objects/currency-code';

const offsetMessage = 'Los días de anticipación deben ser enteros mayores o iguales a cero.';
const thresholdMessage = 'El umbral debe ser un entero mayor o igual a cero.';

const validProps: CreateSettingsData = {
  currency: 'MXN',
  locale: 'es-MX',
  reminderOffsetsDays: [30, 7, 1],
  notificationsEnabled: true,
  theme: 'system',
  expiringThresholdDays: 30,
};

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });

describe('Settings Entity', () => {
  test('crea la configuración con sus datos normalizados', () => {
    const settings = Settings.create({ ...validProps, locale: '  es-MX  ' });

    expect(settings).toBeInstanceOf(Settings);
    expect({ ...settings }).toEqual(validProps);
  });

  test.each(currencyCodes)('admite la moneda %s', (currency) => {
    expect(Settings.create({ ...validProps, currency }).currency).toBe(currency);
  });

  test.each(themes)('admite el tema %s', (theme) => {
    expect(Settings.create({ ...validProps, theme }).theme).toBe(theme);
  });

  test.each([true, false])('conserva notificationsEnabled %s', (notificationsEnabled) => {
    expect(Settings.create({ ...validProps, notificationsEnabled }).notificationsEnabled).toBe(
      notificationsEnabled,
    );
  });

  test.each([{ offsets: [] }, { offsets: [0] }])('admite los avisos $offsets', ({ offsets }) => {
    expect(Settings.create({ ...validProps, reminderOffsetsDays: offsets }).reminderOffsetsDays).toEqual(offsets);
  });

  test('admite un umbral de cero', () => {
    expect(Settings.create({ ...validProps, expiringThresholdDays: 0 }).expiringThresholdDays).toBe(0);
  });

  test('guarda una copia congelada de los días de anticipación', () => {
    const reminderOffsetsDays = [30, 7];
    const settings = Settings.create({ ...validProps, reminderOffsetsDays });

    reminderOffsetsDays.push(1);

    expect(settings.reminderOffsetsDays).toEqual([30, 7]);
    expect(Object.isFrozen(settings.reminderOffsetsDays)).toBe(true);
    expect(Object.isFrozen(reminderOffsetsDays)).toBe(false);
  });

  test.each([
    ['currency', 'XXX', 'La moneda no es válida.'],
    ['locale', '   ', 'El idioma es obligatorio.'],
    ['theme', 'sepia', 'El tema no es válido.'],
    ['reminderOffsetsDays', [30, -1], offsetMessage],
    ['reminderOffsetsDays', [1.5], offsetMessage],
    ['expiringThresholdDays', -1, thresholdMessage],
    ['expiringThresholdDays', 1.5, thresholdMessage],
    ['expiringThresholdDays', NaN, thresholdMessage],
  ])('rechaza %s con el valor %p', (field, value, message) => {
    expect(() => Settings.create({ ...validProps, [field]: value })).toThrow(validationError(message));
  });

  describe('update', () => {
    test('cambia solo los datos enviados sin modificar el original', () => {
      const settings = Settings.create(validProps);
      const updated = settings.update({ theme: 'dark', notificationsEnabled: false });

      expect(updated).toBeInstanceOf(Settings);
      expect(updated).not.toBe(settings);
      expect({ ...updated }).toEqual({ ...validProps, theme: 'dark', notificationsEnabled: false });
      expect({ ...settings }).toEqual(validProps);
    });

    test('valida los cambios', () => {
      expect(() => Settings.create(validProps).update({ locale: '' })).toThrow(
        validationError('El idioma es obligatorio.'),
      );
    });
  });

  test('impide modificar sus datos en ejecución', () => {
    const settings = Settings.create(validProps);

    expect(Reflect.set(settings, 'theme', 'dark')).toBe(false);
    expect(settings.theme).toBe('system');
  });
});
