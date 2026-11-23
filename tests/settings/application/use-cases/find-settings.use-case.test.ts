import { FindSettingsUseCase } from '@/settings/application/use-cases/find-settings.use-case';

import {
  createSeededContext,
  entities,
  createTestContext,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindSettingsUseCase', () => {
  let context: TestContext;
  let useCase: FindSettingsUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindSettingsUseCase({
      settingsRepository: context.settings,
    });
  });

  test('devuelve la configuración guardada', async () => {
    expect(await useCase.execute()).toBe(entities.settings);
  });

  test('lanza NotFoundError si no hay configuración', async () => {
    await expect(new FindSettingsUseCase({
      settingsRepository: createTestContext().settings,
    }).execute()).rejects.toThrow(
      notFoundError('Configuración no encontrada.'),
    );
  });
});
