import { UpdateWarrantyUseCase } from '@/warranties/application/use-cases/update-warranty.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('UpdateWarrantyUseCase', () => {
  let context: TestContext;
  let useCase: UpdateWarrantyUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new UpdateWarrantyUseCase({
      warrantyRepository: context.warranties,
      productRepository: context.products,
      scheduleWarrantyReminders: context.scheduleWarrantyReminders,
      clock: context.clock,
    });
  });

  test('actualiza, guarda y conserva los demás datos', async () => {
    const warranty = await useCase.execute(`  ${ids.warranty.toUpperCase()}  `, { provider: 'Seguro' });

    expect({ ...warranty }).toEqual({ ...entities.warranty, provider: 'Seguro', updatedAt: today });
    expect(await context.warranties.findById(ids.warranty)).toBe(warranty);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.warranties, 'save');

    await expect(useCase.execute(ids.warranty, { startDate: '2026-01-09' })).rejects.toThrow(
      validationError('La garantía no puede iniciar antes de la fecha de compra.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, {})).rejects.toThrow(notFoundError('Garantía no encontrada.'));
  });

  test('reprograma los recordatorios si cambia el vencimiento', async () => {
    await useCase.execute(ids.warranty, { durationMonths: 24 });
    const scheduled = await context.reminders.findByStatus('scheduled');

    expect((await context.reminders.findById(ids.reminder))?.status).toBe('cancelled');
    expect(scheduled.map(({ fireAt }) => fireAt)).toEqual(['2027-12-11', '2028-01-03']);
  });

  test('no toca los recordatorios si el vencimiento no cambia', async () => {
    const save = jest.spyOn(context.reminders, 'save');

    await useCase.execute(ids.warranty, { provider: 'Seguro' });

    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si falta su producto', async () => {
    await context.products.delete(ids.product);

    await expect(useCase.execute(ids.warranty, {})).rejects.toThrow(notFoundError('Producto no encontrado.'));
  });
});
