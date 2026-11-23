import { InitializeSettingsUseCase } from '@/settings/application/use-cases/initialize-settings.use-case';

import {
  createSeededContext,
  entities,
  createTestContext,
  settingsData,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('InitializeSettingsUseCase', () => {
  let context: TestContext;
  let useCase: InitializeSettingsUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new InitializeSettingsUseCase(context.settings);
  });

  test('conserva la configuración existente', async () => {
    expect(await useCase.execute({ ...settingsData, theme: 'dark' })).toBe(entities.settings);
  });

  test('guarda la configuración inicial si no existe', async () => {
    const { settings } = createTestContext();

    const created = await new InitializeSettingsUseCase(settings).execute(settingsData);

    expect({ ...created }).toEqual(settingsData);
    expect(await settings.find()).toBe(created);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const { settings } = createTestContext();

    await expect(
      new InitializeSettingsUseCase(settings).execute({ ...settingsData, locale: '' }),
    ).rejects.toThrow(validationError('El idioma es obligatorio.'));
    expect(await settings.find()).toBeUndefined();
  });
});
