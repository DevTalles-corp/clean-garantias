import { FindAllWarrantiesUseCase } from '@/warranties/application/use-cases/find-all-warranties.use-case';

import {
  createSeededContext,
  entities,
  ids,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindAllWarrantiesUseCase', () => {
  let context: TestContext;
  let useCase: FindAllWarrantiesUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindAllWarrantiesUseCase({
      warrantyRepository: context.warranties,
    });
  });

  test('devuelve todos los registros', async () => {
    expect(await useCase.execute()).toEqual([entities.warranty]);
  });

  test('devuelve una lista vacía si no hay registros', async () => {
    await context.warranties.delete(ids.warranty);

    expect(await useCase.execute()).toEqual([]);
  });
});
