import { DeleteAttachmentUseCase } from '@/attachments/application/use-cases/delete-attachment.use-case';

import {
  createSeededContext,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('DeleteAttachmentUseCase', () => {
  let context: TestContext;
  let useCase: DeleteAttachmentUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new DeleteAttachmentUseCase(context.attachments);
  });

  test('borra el adjunto', async () => {
    await useCase.execute(`  ${ids.attachment.toUpperCase()}  `);

    expect(await context.attachments.findById(ids.attachment)).toBeUndefined();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Adjunto no encontrado.'));
  });
});
