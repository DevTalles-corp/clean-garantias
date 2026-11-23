import { UpdateCategoryUseCase } from '@/categories/application/use-cases/update-category.use-case';
import { Category } from '@/categories/domain/entities/category.entity';

import {
  conflictError,
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('UpdateCategoryUseCase', () => {
  let context: TestContext;
  let useCase: UpdateCategoryUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new UpdateCategoryUseCase(context.categories);
  });

  test('actualiza, guarda y conserva los demás datos', async () => {
    const category = await useCase.execute(`  ${ids.category.toUpperCase()}  `, { name: 'Hogar' });

    expect({ ...category }).toEqual({ ...entities.category, name: 'Hogar' });
    expect(await context.categories.findById(ids.category)).toBe(category);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.categories, 'save');

    await expect(useCase.execute(ids.category, { color: 'rojo' })).rejects.toThrow(
      validationError('El color debe ser un valor hexadecimal válido.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, {})).rejects.toThrow(notFoundError('Categoría no encontrada.'));
  });

  test('conserva la identidad aunque se envíen esos campos', async () => {
    const untrusted = { name: 'Otra', id: missingId, createdAt: today };

    expect(await useCase.execute(ids.category, untrusted)).toMatchObject({
      id: ids.category,
      createdAt: '2026-01-01',
    });
  });

  test('lanza ConflictError si es del sistema', async () => {
    await context.categories.save(Category.create({ ...entities.category, isSystem: true }));

    await expect(useCase.execute(ids.category, { name: 'Otra' })).rejects.toThrow(
      conflictError('No se puede modificar una categoría del sistema.'),
    );
  });
});
