import { Settings } from '@/settings/domain/entities/settings.entity';
import { SettingsMapper } from '@/settings/infrastructure/mappers/settings.mapper';

const settings = Settings.create({
  currency: 'MXN',
  locale: 'es-MX',
  reminderOffsetsDays: [30, 7, 1],
  notificationsEnabled: false,
  theme: 'dark',
  expiringThresholdDays: 30,
});

describe('SettingsMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = SettingsMapper.toDomain(SettingsMapper.toRow(settings));

    expect(restored).toBeInstanceOf(Settings);
    expect({ ...restored }).toEqual({ ...settings });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() =>
      SettingsMapper.toDomain({ ...SettingsMapper.toRow(settings), theme: 'x' }),
    ).toThrow(expect.objectContaining({ name: 'ValidationError' }));
  });
});
