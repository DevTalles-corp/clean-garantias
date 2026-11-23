import { FindAllProductsUseCase } from '@/products/application/use-cases/find-all-products.use-case';

import {
  createSeededContext,
  entities,
  ids,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindAllProductsUseCase', () => {
  let context: TestContext;
  let useCase: FindAllProductsUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindAllProductsUseCase(context.products);
  });

  test('devuelve todos los registros', async () => {
    expect(await useCase.execute()).toEqual([entities.product]);
  });

  test('devuelve una lista vacía si no hay registros', async () => {
    await context.products.delete(ids.product);

    expect(await useCase.execute()).toEqual([]);
  });
});
