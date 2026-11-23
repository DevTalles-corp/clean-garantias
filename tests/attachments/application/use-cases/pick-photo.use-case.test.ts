import { PickPhotoUseCase } from '@/attachments/application/use-cases/pick-photo.use-case';
import { maxAttachmentBytes } from '@/attachments/domain/entities/attachment.entity';

import { createTestContext, pickedPhoto, validationError } from '../../../shared/application/test-context';

describe('PickPhotoUseCase', () => {
  const { photoLibrary } = createTestContext();
  const useCase = new PickPhotoUseCase({ photoLibrary });

  test.each([1, maxAttachmentBytes])('acepta una imagen de %d bytes', async (sizeBytes) => {
    photoLibrary.picked = { ...pickedPhoto, sizeBytes };
    expect(await useCase.execute('1')).toEqual({ ...pickedPhoto, sizeBytes });
  });

  test.each([
    [{ mimeType: '' }, 'El archivo debe ser una imagen.'],
    [{ mimeType: 'video/mp4' }, 'El archivo debe ser una imagen.'],
    [{ sizeBytes: 0 }, 'No se pudo leer la foto.'],
    [{ sizeBytes: maxAttachmentBytes + 1 }, 'El archivo no puede superar los 10 MB.'],
  ])('rechaza %j', async (changes, message) => {
    photoLibrary.picked = { ...pickedPhoto, ...changes };
    await expect(useCase.execute('1')).rejects.toThrow(validationError(message));
  });
});
