import { DeleteCategoryUseCase } from '@/categories/application/use-cases/delete-category.use-case';
import { Category } from '@/categories/domain/entities/category.entity';

import {
  conflictError,
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('DeleteCategoryUseCase', () => {
  let context: TestContext;
  let useCase: DeleteCategoryUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new DeleteCategoryUseCase(context.categories, context.products);
  });

  test('borra el registro si no está en uso', async () => {
    await context.products.delete(ids.product);

    await useCase.execute(`  ${ids.category.toUpperCase()}  `);

    expect(await context.categories.findById(ids.category)).toBeUndefined();
  });

  test('lanza ConflictError y no borra si tiene productos', async () => {
    await expect(useCase.execute(ids.category)).rejects.toThrow(
      conflictError('No se puede borrar una categoría con productos.'),
    );
    expect(await context.categories.findById(ids.category)).toBe(entities.category);
  });

  test('lanza ConflictError y no borra si es del sistema', async () => {
    await context.products.delete(ids.product);
    await context.categories.save(Category.create({ ...entities.category, isSystem: true }));

    await expect(useCase.execute(ids.category)).rejects.toThrow(
      conflictError('No se puede borrar una categoría del sistema.'),
    );
    expect(await context.categories.findById(ids.category)).toBeDefined();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Categoría no encontrada.'));
  });
});
