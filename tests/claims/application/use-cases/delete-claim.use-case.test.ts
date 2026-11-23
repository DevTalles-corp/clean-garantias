import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import { DeleteClaimUseCase } from '@/claims/application/use-cases/delete-claim.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  testId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('DeleteClaimUseCase', () => {
  let context: TestContext;
  let useCase: DeleteClaimUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new DeleteClaimUseCase({
      claimRepository: context.claims,
      attachmentRepository: context.attachments,
    });
  });

  test('borra el reclamo y sus adjuntos, y conserva los ajenos', async () => {
    await context.attachments.save(
      Attachment.create({ ...entities.attachment, id: testId(8), ownerType: 'claim', ownerId: ids.claim }),
    );

    await useCase.execute(`  ${ids.claim.toUpperCase()}  `);

    expect(await context.claims.findById(ids.claim)).toBeUndefined();
    expect(await context.attachments.findAll()).toEqual([entities.attachment]);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Reclamo no encontrado.'));
  });
});
