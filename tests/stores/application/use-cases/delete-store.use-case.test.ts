import { DeleteStoreUseCase } from '@/stores/application/use-cases/delete-store.use-case';

import {
  conflictError,
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('DeleteStoreUseCase', () => {
  let context: TestContext;
  let useCase: DeleteStoreUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new DeleteStoreUseCase({
      storeRepository: context.stores,
      productRepository: context.products,
    });
  });

  test('borra el registro si no está en uso', async () => {
    await context.products.delete(ids.product);

    await useCase.execute(`  ${ids.store.toUpperCase()}  `);

    expect(await context.stores.findById(ids.store)).toBeUndefined();
  });

  test('lanza ConflictError y no borra si tiene productos', async () => {
    await expect(useCase.execute(ids.store)).rejects.toThrow(
      conflictError('No se puede borrar una tienda con productos.'),
    );
    expect(await context.stores.findById(ids.store)).toBe(entities.store);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Tienda no encontrada.'));
  });
});
