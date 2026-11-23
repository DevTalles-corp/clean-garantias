import { UpdateStoreUseCase } from '@/stores/application/use-cases/update-store.use-case';

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

describe('UpdateStoreUseCase', () => {
  let context: TestContext;
  let useCase: UpdateStoreUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new UpdateStoreUseCase(context.stores);
  });

  test('actualiza, guarda y conserva los demás datos', async () => {
    const store = await useCase.execute(`  ${ids.store.toUpperCase()}  `, { name: 'Otra', phone: undefined });

    expect({ ...store }).toEqual({ ...entities.store, name: 'Otra', phone: undefined });
    expect(await context.stores.findById(ids.store)).toBe(store);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.stores, 'save');

    await expect(useCase.execute(ids.store, { name: ' ' })).rejects.toThrow(
      validationError('El nombre es obligatorio.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, {})).rejects.toThrow(notFoundError('Tienda no encontrada.'));
  });

  test('conserva la identidad aunque se envíen esos campos', async () => {
    const untrusted = { name: 'Otra', id: missingId, createdAt: today };

    expect(await useCase.execute(ids.store, untrusted)).toMatchObject({
      id: ids.store,
      createdAt: '2026-01-01',
    });
  });
});
