import { FindClaimByIdUseCase } from '@/claims/application/use-cases/find-claim-by-id.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindClaimByIdUseCase', () => {
  let context: TestContext;
  let useCase: FindClaimByIdUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindClaimByIdUseCase({ claimRepository: context.claims });
  });

  test.each([ids.claim, `  ${ids.claim.toUpperCase()}  `])('devuelve la entidad con el id %p', async (id) => {
    expect(await useCase.execute(id)).toBe(entities.claim);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Reclamo no encontrado.'));
  });
});
