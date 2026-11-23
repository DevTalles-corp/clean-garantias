import type { SQLiteDatabase } from 'expo-sqlite';

import { Settings } from '@/settings/domain/entities/settings.entity';
import { SqliteSettingsRepository } from '@/settings/infrastructure/repositories/sqlite.settings-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

const settings = Settings.create({
  currency: 'MXN',
  locale: 'es-MX',
  reminderOffsetsDays: [30, 7, 1],
  notificationsEnabled: false,
  theme: 'dark',
  expiringThresholdDays: 30,
});

describe('SqliteSettingsRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteSettingsRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteSettingsRepository(database);
  });

  test('devuelve undefined si aún no se ha guardado', async () => {
    expect(await repository.find()).toBeUndefined();
  });

  test('guarda y recupera la configuración', async () => {
    await repository.save(settings);
    expect({ ...(await repository.find()) }).toEqual({ ...settings });
  });

  test('reemplaza la única configuración', async () => {
    await repository.save(settings);
    await repository.save(settings.update({ theme: 'light' }));

    expect((await repository.find())?.theme).toBe('light');
    expect(await database.getAllAsync('SELECT * FROM settings')).toHaveLength(1);
  });
});
