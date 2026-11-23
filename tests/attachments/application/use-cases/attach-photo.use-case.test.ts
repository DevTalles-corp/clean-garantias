import { AttachPhotoUseCase } from '@/attachments/application/use-cases/attach-photo.use-case';
import { CreateAttachmentUseCase } from '@/attachments/application/use-cases/create-attachment.use-case';

import {
  createSeededContext,
  ids,
  missingId,
  notFoundError,
  pickedPhoto,
  type TestContext,
} from '../../../shared/application/test-context';

describe('AttachPhotoUseCase', () => {
  let context: TestContext;
  let useCase: AttachPhotoUseCase;
  const input = { ownerType: 'product', ownerId: ids.product, kind: 'receipt', photo: pickedPhoto } as const;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new AttachPhotoUseCase({
      attachmentStorage: context.attachmentStorage,
      createAttachment: new CreateAttachmentUseCase({
        attachmentRepository: context.attachments,
        productRepository: context.products,
        warrantyRepository: context.warranties,
        claimRepository: context.claims,
        idGenerator: context.idGenerator,
        clock: context.clock,
      }),
    });
  });

  test('copia el archivo y registra el adjunto con sus datos reales', async () => {
    const attachment = await useCase.execute(input);

    expect(attachment).toMatchObject({
      ownerId: ids.product,
      kind: 'receipt',
      fileUri: 'receipts/recibo.jpg',
      fileName: 'recibo.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 100,
    });
    expect(context.attachmentStorage.files.get('receipts/recibo.jpg')).toBe(pickedPhoto.uri);
    expect(await context.attachments.findById(attachment.id)).toBe(attachment);
  });

  test('si falla la copia no registra nada', async () => {
    const save = jest.spyOn(context.attachments, 'save');
    jest.spyOn(context.attachmentStorage, 'save').mockRejectedValue(new Error('sin espacio'));

    await expect(useCase.execute(input)).rejects.toThrow('sin espacio');
    expect(save).not.toHaveBeenCalled();
  });

  test('si falla el registro borra la copia', async () => {
    await expect(useCase.execute({ ...input, ownerId: missingId })).rejects.toThrow(
      notFoundError('Dueño del adjunto no encontrado.'),
    );
    expect(context.attachmentStorage.files.size).toBe(0);
  });

  test('conserva el error del registro aunque falle el borrado de la copia', async () => {
    jest.spyOn(context.attachmentStorage, 'delete').mockRejectedValue(new Error('bloqueado'));

    await expect(useCase.execute({ ...input, ownerId: missingId })).rejects.toThrow(
      notFoundError('Dueño del adjunto no encontrado.'),
    );
  });
});
