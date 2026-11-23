// Caso de uso de aplicación: copia una foto elegida y la registra como adjunto.
// Une archivo y registro; sin él, un fallo dejaría copias sin dueño.

import type { CreateAttachmentUseCase } from '@/attachments/application/use-cases/create-attachment.use-case';
import type {
  Attachment,
  AttachmentKind,
  AttachmentOwner,
} from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentStorage } from '@/attachments/domain/services/attachment-storage';
import type { PickedPhoto } from '@/attachments/domain/services/photo-library';

export interface AttachPhotoDependencies {
  attachmentStorage: AttachmentStorage;
  createAttachment: CreateAttachmentUseCase;
}

export interface AttachPhotoData {
  ownerType: AttachmentOwner;
  ownerId: string;
  kind: AttachmentKind;
  photo: PickedPhoto;
}

export class AttachPhotoUseCase {
  private readonly attachmentStorage: AttachmentStorage;
  private readonly createAttachment: CreateAttachmentUseCase;

  constructor({ attachmentStorage, createAttachment }: AttachPhotoDependencies) {
    this.attachmentStorage = attachmentStorage;
    this.createAttachment = createAttachment;
  }

  async execute({ photo, ...owner }: AttachPhotoData): Promise<Attachment> {
    const { uri, fileName, mimeType, sizeBytes } = photo;
    const fileUri = await this.attachmentStorage.save(uri, fileName);
    try {
      return await this.createAttachment.execute({ ...owner, fileUri, fileName, mimeType, sizeBytes });
    } catch (error) {
      // El error que importa es el del registro, no el de limpiar la copia.
      await this.attachmentStorage.delete(fileUri).catch(() => undefined);
      throw error;
    }
  }
}
