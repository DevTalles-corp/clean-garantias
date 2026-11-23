import { UpdateClaimUseCase } from '@/claims/application/use-cases/update-claim.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('UpdateClaimUseCase', () => {
  let context: TestContext;
  let useCase: UpdateClaimUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new UpdateClaimUseCase({
      claimRepository: context.claims,
      clock: context.clock,
    });
  });

  test('actualiza, guarda y conserva los demás datos', async () => {
    const claim = await useCase.execute(`  ${ids.claim.toUpperCase()}  `, { status: 'resolved', resolvedAt: today });

    expect({ ...claim }).toEqual({ ...entities.claim, status: 'resolved', resolvedAt: today, updatedAt: today });
    expect(await context.claims.findById(ids.claim)).toBe(claim);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.claims, 'save');

    await expect(useCase.execute(ids.claim, { status: 'rejected' })).rejects.toThrow(
      validationError('Un reclamo resuelto o rechazado requiere fecha de resolución.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, {})).rejects.toThrow(notFoundError('Reclamo no encontrado.'));
  });
});
