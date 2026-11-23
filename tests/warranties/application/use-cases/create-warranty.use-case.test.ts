import { CreateWarrantyUseCase } from '@/warranties/application/use-cases/create-warranty.use-case';
import { Warranty, type CreateWarrantyData } from '@/warranties/domain/entities/warranty.entity';

import {
  createSeededContext,
  firstGeneratedId,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const input: CreateWarrantyData = {
  type: 'extended',
  provider: '  Seguro  ',
  startDate: '2026-02-01',
  durationMonths: 12,
};

describe('CreateWarrantyUseCase', () => {
  let context: TestContext;
  let useCase: CreateWarrantyUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new CreateWarrantyUseCase({
      warrantyRepository: context.warranties,
      productRepository: context.products,
      scheduleWarrantyReminders: context.scheduleWarrantyReminders,
      idGenerator: context.idGenerator,
      clock: context.clock,
    });
  });

  test('crea, guarda y devuelve la entidad con id y fecha inyectados', async () => {
    const warranty = await useCase.execute(ids.product, input);

    expect(warranty).toBeInstanceOf(Warranty);
    expect(warranty).toMatchObject({
      id: firstGeneratedId,
      productId: ids.product,
      provider: 'Seguro',
      endDate: '2027-02-01',
      createdAt: today,
    });
    expect(await context.warranties.findById(firstGeneratedId)).toBe(warranty);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.warranties, 'save');

    await expect(
      useCase.execute(ids.product, { ...input, startDate: '2026-01-09' }),
    ).rejects.toThrow(validationError('La garantía no puede iniciar antes de la fecha de compra.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('programa los recordatorios según la configuración', async () => {
    const warranty = await useCase.execute(ids.product, input);
    const reminders = await context.reminders.findByWarrantyId(warranty.id);

    expect(reminders.map(({ fireAt }) => fireAt)).toEqual(['2027-01-02', '2027-01-25']);
  });

  test('lanza NotFoundError si el producto no existe', async () => {
    await expect(useCase.execute(missingId, input)).rejects.toThrow(notFoundError('Producto no encontrado.'));
  });
});
