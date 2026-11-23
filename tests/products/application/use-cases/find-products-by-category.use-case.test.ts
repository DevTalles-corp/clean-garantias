import { FindProductsByCategoryUseCase } from '@/products/application/use-cases/find-products-by-category.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindProductsByCategoryUseCase', () => {
  let context: TestContext;
  let useCase: FindProductsByCategoryUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindProductsByCategoryUseCase(context.products);
  });

  test('normaliza el id y devuelve los registros relacionados', async () => {
    expect(await useCase.execute(`  ${ids.category.toUpperCase()}  `)).toEqual([entities.product]);
  });

  test('devuelve una lista vacía si no hay registros relacionados', async () => {
    expect(await useCase.execute(missingId)).toEqual([]);
  });
});
