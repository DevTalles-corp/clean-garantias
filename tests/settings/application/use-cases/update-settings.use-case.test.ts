import { UpdateSettingsUseCase } from '@/settings/application/use-cases/update-settings.use-case';

import {
  createSeededContext,
  entities,
  createTestContext,
  notFoundError,
  settingsData,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('UpdateSettingsUseCase', () => {
  let context: TestContext;
  let useCase: UpdateSettingsUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new UpdateSettingsUseCase(
      context.settings,
      context.warranties,
      context.scheduleWarrantyReminders,
    );
  });

  test('actualiza y guarda sin tocar los recordatorios si no les afecta', async () => {
    const save = jest.spyOn(context.reminders, 'save');

    const settings = await useCase.execute({ theme: 'dark' });

    expect({ ...settings }).toEqual({ ...settingsData, theme: 'dark' });
    expect(await context.settings.find()).toBe(settings);
    expect(save).not.toHaveBeenCalled();
  });

  test('reprograma los recordatorios si cambian los días de anticipación', async () => {
    await useCase.execute({ reminderOffsetsDays: [1] });
    const scheduled = await context.reminders.findByStatus('scheduled');

    expect(scheduled.map(({ offsetDays }) => offsetDays)).toEqual([1]);
  });

  test('cancela los recordatorios al apagar las notificaciones', async () => {
    await useCase.execute({ notificationsEnabled: false });

    expect(await context.reminders.findByStatus('scheduled')).toEqual([]);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    await expect(useCase.execute({ locale: '' })).rejects.toThrow(validationError('El idioma es obligatorio.'));
    expect(await context.settings.find()).toBe(entities.settings);
  });

  test('lanza NotFoundError si no hay configuración', async () => {
    const empty = createTestContext();

    await expect(
      new UpdateSettingsUseCase(
        empty.settings,
        empty.warranties,
        empty.scheduleWarrantyReminders,
      ).execute({}),
    ).rejects.toThrow(notFoundError('Configuración no encontrada.'));
  });
});
