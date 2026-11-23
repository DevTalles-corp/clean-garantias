import { SetWarrantyArchivedUseCase } from '@/warranties/application/use-cases/set-warranty-archived.use-case';

import {
  createSeededContext,
  ids,
  missingId,
  notFoundError,
  today,
  type TestContext,
} from '../../../shared/application/test-context';

describe('SetWarrantyArchivedUseCase', () => {
  let context: TestContext;
  let useCase: SetWarrantyArchivedUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new SetWarrantyArchivedUseCase(
      context.warranties,
      context.scheduleWarrantyReminders,
      context.clock,
    );
  });

  test('archiva la garantía y cancela sus recordatorios', async () => {
    const warranty = await useCase.execute(`  ${ids.warranty.toUpperCase()}  `, true);

    expect(warranty).toMatchObject({ isArchived: true, updatedAt: today });
    expect(await context.warranties.findById(ids.warranty)).toBe(warranty);
    expect(await context.reminders.findByStatus('scheduled')).toEqual([]);
  });

  test('recupera la garantía y vuelve a programar sus recordatorios', async () => {
    await useCase.execute(ids.warranty, true);

    const warranty = await useCase.execute(ids.warranty, false);

    expect(warranty.isArchived).toBe(false);
    expect(await context.reminders.findByStatus('scheduled')).toHaveLength(2);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, true)).rejects.toThrow(notFoundError('Garantía no encontrada.'));
  });
});
