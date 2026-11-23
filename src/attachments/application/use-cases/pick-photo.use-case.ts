// Caso de uso de aplicación: obtiene una foto de la galería si sirve como adjunto.
// Valida tipo y tamaño al elegirla; sin él, el rechazo llegaría al guardar la compra.

import { maxAttachmentBytes } from '@/attachments/domain/entities/attachment.entity';
import type { PhotoLibrary, PickedPhoto } from '@/attachments/domain/services/photo-library';
import { ValidationError } from '@/shared/domain/errors/domain.errors';

export interface PickPhotoDependencies {
  photoLibrary: PhotoLibrary;
}

export class PickPhotoUseCase {
  private readonly photoLibrary: PhotoLibrary;

  constructor({ photoLibrary }: PickPhotoDependencies) {
    this.photoLibrary = photoLibrary;
  }

  async execute(id: string): Promise<PickedPhoto> {
    const photo = await this.photoLibrary.getPhoto(id);
    if (!photo.mimeType.toLowerCase().startsWith('image/')) {
      throw new ValidationError('El archivo debe ser una imagen.');
    }
    if (photo.sizeBytes <= 0) {
      throw new ValidationError('No se pudo leer la foto.');
    }
    if (photo.sizeBytes > maxAttachmentBytes) {
      throw new ValidationError('El archivo no puede superar los 10 MB.');
    }
    return photo;
  }
}
