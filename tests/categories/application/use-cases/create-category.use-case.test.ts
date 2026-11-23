import { CreateCategoryUseCase } from '@/categories/application/use-cases/create-category.use-case';
import { Category, type CreateCategoryData } from '@/categories/domain/entities/category.entity';

import {
  createSeededContext,
  firstGeneratedId,
  ids,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const input: CreateCategoryData = {
  name: '  Hogar  ',
  icon: 'house',
  color: '#FFFFFF',
  defaultWarrantyMonths: 24,
};

describe('CreateCategoryUseCase', () => {
  let context: TestContext;
  let useCase: CreateCategoryUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new CreateCategoryUseCase(
      context.categories,
      context.idGenerator,
      context.clock,
    );
  });

  test('crea, guarda y devuelve la entidad con id y fecha inyectados', async () => {
    const category = await useCase.execute(input);

    expect(category).toBeInstanceOf(Category);
    expect(category).toMatchObject({ id: firstGeneratedId, name: 'Hogar', isSystem: false, createdAt: today });
    expect(await context.categories.findById(firstGeneratedId)).toBe(category);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.categories, 'save');

    await expect(
      useCase.execute({ ...input, name: ' ' }),
    ).rejects.toThrow(validationError('El nombre es obligatorio.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('nunca crea una categoría del sistema ni acepta un id externo', async () => {
    const untrusted = { ...input, isSystem: true, id: ids.category };

    expect(await useCase.execute(untrusted)).toMatchObject({ id: firstGeneratedId, isSystem: false });
  });
});
