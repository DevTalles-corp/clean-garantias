import { FindProductByIdUseCase } from '@/products/application/use-cases/find-product-by-id.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindProductByIdUseCase', () => {
  let context: TestContext;
  let useCase: FindProductByIdUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindProductByIdUseCase(context.products);
  });

  test.each([ids.product, `  ${ids.product.toUpperCase()}  `])('devuelve la entidad con el id %p', async (id) => {
    expect(await useCase.execute(id)).toBe(entities.product);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Producto no encontrado.'));
  });
});
