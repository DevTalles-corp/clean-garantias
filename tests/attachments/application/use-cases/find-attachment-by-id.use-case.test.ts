import { FindAttachmentByIdUseCase } from '@/attachments/application/use-cases/find-attachment-by-id.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindAttachmentByIdUseCase', () => {
  let context: TestContext;
  let useCase: FindAttachmentByIdUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindAttachmentByIdUseCase({
      attachmentRepository: context.attachments,
    });
  });

  test.each([ids.attachment, `  ${ids.attachment.toUpperCase()}  `])('devuelve la entidad con el id %p', async (id) => {
    expect(await useCase.execute(id)).toBe(entities.attachment);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Adjunto no encontrado.'));
  });
});
