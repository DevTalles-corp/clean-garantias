import { FindWarrantiesByProductUseCase } from '@/warranties/application/use-cases/find-warranties-by-product.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindWarrantiesByProductUseCase', () => {
  let context: TestContext;
  let useCase: FindWarrantiesByProductUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindWarrantiesByProductUseCase(context.warranties);
  });

  test('normaliza el id y devuelve los registros relacionados', async () => {
    expect(await useCase.execute(`  ${ids.product.toUpperCase()}  `)).toEqual([entities.warranty]);
  });

  test('devuelve una lista vacía si no hay registros relacionados', async () => {
    expect(await useCase.execute(missingId)).toEqual([]);
  });
});
