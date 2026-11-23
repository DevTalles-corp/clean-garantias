import { FindAllCategoriesUseCase } from '@/categories/application/use-cases/find-all-categories.use-case';

import {
  createSeededContext,
  entities,
  ids,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindAllCategoriesUseCase', () => {
  let context: TestContext;
  let useCase: FindAllCategoriesUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindAllCategoriesUseCase({
      categoryRepository: context.categories,
    });
  });

  test('devuelve todos los registros', async () => {
    expect(await useCase.execute()).toEqual([entities.category]);
  });

  test('devuelve una lista vacía si no hay registros', async () => {
    await context.categories.delete(ids.category);

    expect(await useCase.execute()).toEqual([]);
  });
});
