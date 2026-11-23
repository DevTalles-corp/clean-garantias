import { FindStoreByIdUseCase } from '@/stores/application/use-cases/find-store-by-id.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindStoreByIdUseCase', () => {
  let context: TestContext;
  let useCase: FindStoreByIdUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindStoreByIdUseCase(context.stores);
  });

  test.each([ids.store, `  ${ids.store.toUpperCase()}  `])('devuelve la entidad con el id %p', async (id) => {
    expect(await useCase.execute(id)).toBe(entities.store);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Tienda no encontrada.'));
  });
});
