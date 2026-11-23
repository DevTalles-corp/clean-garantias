import { FindProductsByStoreUseCase } from '@/products/application/use-cases/find-products-by-store.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindProductsByStoreUseCase', () => {
  let context: TestContext;
  let useCase: FindProductsByStoreUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindProductsByStoreUseCase(context.products);
  });

  test('normaliza el id y devuelve los registros relacionados', async () => {
    expect(await useCase.execute(`  ${ids.store.toUpperCase()}  `)).toEqual([entities.product]);
  });

  test('devuelve una lista vacía si no hay registros relacionados', async () => {
    expect(await useCase.execute(missingId)).toEqual([]);
  });
});
