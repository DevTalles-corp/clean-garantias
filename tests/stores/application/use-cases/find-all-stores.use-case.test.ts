import { FindAllStoresUseCase } from '@/stores/application/use-cases/find-all-stores.use-case';

import {
  createSeededContext,
  entities,
  ids,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindAllStoresUseCase', () => {
  let context: TestContext;
  let useCase: FindAllStoresUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindAllStoresUseCase(context.stores);
  });

  test('devuelve todos los registros', async () => {
    expect(await useCase.execute()).toEqual([entities.store]);
  });

  test('devuelve una lista vacía si no hay registros', async () => {
    await context.stores.delete(ids.store);

    expect(await useCase.execute()).toEqual([]);
  });
});
