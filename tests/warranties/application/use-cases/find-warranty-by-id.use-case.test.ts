import { FindWarrantyByIdUseCase } from '@/warranties/application/use-cases/find-warranty-by-id.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindWarrantyByIdUseCase', () => {
  let context: TestContext;
  let useCase: FindWarrantyByIdUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindWarrantyByIdUseCase({
      warrantyRepository: context.warranties,
    });
  });

  test.each([ids.warranty, `  ${ids.warranty.toUpperCase()}  `])('devuelve la entidad con el id %p', async (id) => {
    expect(await useCase.execute(id)).toBe(entities.warranty);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Garantía no encontrada.'));
  });
});
