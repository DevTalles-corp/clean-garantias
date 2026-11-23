import { FindClaimsByWarrantyUseCase } from '@/claims/application/use-cases/find-claims-by-warranty.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindClaimsByWarrantyUseCase', () => {
  let context: TestContext;
  let useCase: FindClaimsByWarrantyUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindClaimsByWarrantyUseCase({
      claimRepository: context.claims,
    });
  });

  test('normaliza el id y devuelve los registros relacionados', async () => {
    expect(await useCase.execute(`  ${ids.warranty.toUpperCase()}  `)).toEqual([entities.claim]);
  });

  test('devuelve una lista vacía si no hay registros relacionados', async () => {
    expect(await useCase.execute(missingId)).toEqual([]);
  });
});
