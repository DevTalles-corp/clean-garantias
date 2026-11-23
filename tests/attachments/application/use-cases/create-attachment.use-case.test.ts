import { CreateAttachmentUseCase } from '@/attachments/application/use-cases/create-attachment.use-case';
import { Attachment, type CreateAttachmentData, attachmentOwners } from '@/attachments/domain/entities/attachment.entity';

import {
  createSeededContext,
  firstGeneratedId,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const input: CreateAttachmentData = {
  ownerType: 'product',
  ownerId: ids.product,
  kind: 'photo',
  fileUri: 'file:///foto.png',
  fileName: 'foto.png',
  mimeType: 'image/png',
  sizeBytes: 10,
};

describe('CreateAttachmentUseCase', () => {
  let context: TestContext;
  let useCase: CreateAttachmentUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new CreateAttachmentUseCase({
      attachmentRepository: context.attachments,
      productRepository: context.products,
      warrantyRepository: context.warranties,
      claimRepository: context.claims,
      idGenerator: context.idGenerator,
      clock: context.clock,
    });
  });

  test('crea, guarda y devuelve la entidad con id y fecha inyectados', async () => {
    const attachment = await useCase.execute(input);

    expect(attachment).toBeInstanceOf(Attachment);
    expect(attachment).toMatchObject({ id: firstGeneratedId, createdAt: today });
    expect(await context.attachments.findById(firstGeneratedId)).toBe(attachment);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.attachments, 'save');

    await expect(
      useCase.execute({ ...input, mimeType: 'text/plain' }),
    ).rejects.toThrow(validationError('El archivo debe ser una imagen o un PDF.'));
    expect(save).not.toHaveBeenCalled();
  });

  test.each(attachmentOwners)('acepta un dueño existente de tipo %s', async (ownerType) => {
    const attachment = await useCase.execute({ ...input, ownerType, ownerId: ids[ownerType] });

    expect(attachment).toMatchObject({ ownerType, ownerId: ids[ownerType] });
  });

  test.each(attachmentOwners)('lanza NotFoundError si no existe el dueño de tipo %s', async (ownerType) => {
    const save = jest.spyOn(context.attachments, 'save');

    await expect(useCase.execute({ ...input, ownerType, ownerId: missingId })).rejects.toThrow(
      notFoundError('Dueño del adjunto no encontrado.'),
    );
    expect(save).not.toHaveBeenCalled();
  });
});
