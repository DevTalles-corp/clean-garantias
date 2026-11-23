import { FindCategoryByIdUseCase } from '@/categories/application/use-cases/find-category-by-id.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindCategoryByIdUseCase', () => {
  let context: TestContext;
  let useCase: FindCategoryByIdUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindCategoryByIdUseCase(context.categories);
  });

  test.each([ids.category, `  ${ids.category.toUpperCase()}  `])('devuelve la entidad con el id %p', async (id) => {
    expect(await useCase.execute(id)).toBe(entities.category);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Categoría no encontrada.'));
  });
});
