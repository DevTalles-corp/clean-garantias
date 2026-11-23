import { FindWarrantiesByStatusUseCase } from '@/warranties/application/use-cases/find-warranties-by-status.use-case';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';

import {
  createSeededContext,
  entities,
  createTestContext,
  notFoundError,
  testId,
  today,
  type TestContext,
} from '../../../shared/application/test-context';

const expiring = Warranty.restore({ ...entities.warranty, id: testId(40), durationMonths: 6 });
const expired = Warranty.restore({ ...entities.warranty, id: testId(41), durationMonths: 5 });

describe('FindWarrantiesByStatusUseCase', () => {
  let context: TestContext;
  let useCase: FindWarrantiesByStatusUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindWarrantiesByStatusUseCase(
      context.warranties,
      context.settings,
      context.clock,
    );
  });

  beforeEach(async () => {
    // Hoy es 2026-06-15: estas garantías vencen el 2026-07-10 y el 2026-06-10.
    await context.warranties.save(expiring);
    await context.warranties.save(expired);
  });

  test('devuelve solo las garantías con ese estado', async () => {
    expect(await useCase.execute('active')).toEqual([entities.warranty]);
    expect(await useCase.execute('expiring')).toEqual([expiring]);
    expect(await useCase.execute('expired')).toEqual([expired]);
  });

  test('usa el umbral de la configuración', async () => {
    await context.settings.save(entities.settings.update({ expiringThresholdDays: 10 }));

    expect(await useCase.execute('expiring')).toEqual([]);
  });

  test('omite las garantías archivadas', async () => {
    await context.warranties.save(expiring.setArchived(true, today));

    expect(await useCase.execute('expiring')).toEqual([]);
  });

  test('lanza NotFoundError si no hay configuración', async () => {
    const { warranties, settings, clock } = createTestContext();

    await expect(
      new FindWarrantiesByStatusUseCase(warranties, settings, clock).execute('active'),
    ).rejects.toThrow(notFoundError('Configuración no encontrada.'));
  });
});
