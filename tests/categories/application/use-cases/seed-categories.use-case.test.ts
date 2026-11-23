import { SeedCategoriesUseCase } from '@/categories/application/use-cases/seed-categories.use-case';
import type { CreateCategoryData } from '@/categories/domain/entities/category.entity';

import {
  createSeededContext,
  entities,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const inputs: CreateCategoryData[] = ['Hogar', 'Audio'].map((name) => ({
  name,
  icon: 'house',
  color: '#FFFFFF',
  defaultWarrantyMonths: 12,
}));

describe('SeedCategoriesUseCase', () => {
  let context: TestContext;
  let useCase: SeedCategoriesUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new SeedCategoriesUseCase({
      categoryRepository: context.categories,
      idGenerator: context.idGenerator,
      clock: context.clock,
    });
  });

  test('guarda las categorías que faltan como categorías del sistema', async () => {
    await useCase.execute(inputs);
    const seeded = (await context.categories.findAll()).filter(({ isSystem }) => isSystem);

    expect(seeded.map(({ name, createdAt }) => [name, createdAt])).toEqual([
      ['Hogar', today],
      ['Audio', today],
    ]);
  });

  test('no duplica la semilla al ejecutarse de nuevo', async () => {
    await useCase.execute(inputs);
    await useCase.execute(inputs);

    expect(await context.categories.findAll()).toHaveLength(3);
  });

  test('completa una semilla interrumpida', async () => {
    await useCase.execute(inputs.slice(0, 1));
    await useCase.execute(inputs);

    expect((await context.categories.findAll()).map(({ name }) => name)).toEqual([
      'Cómputo',
      'Hogar',
      'Audio',
    ]);
  });

  test('no guarda nada si una categoría es inválida', async () => {
    await expect(useCase.execute([inputs[0], { ...inputs[1], name: '' }])).rejects.toThrow(
      validationError('El nombre es obligatorio.'),
    );
    expect(await context.categories.findAll()).toEqual([entities.category]);
  });
});
