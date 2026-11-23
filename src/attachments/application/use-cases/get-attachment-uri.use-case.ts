// Caso de uso de aplicación: ubica el archivo de un adjunto para mostrarlo.
// Devuelve null si no es propio o no existe; sin él, presentación dependería del almacenamiento.

import type { AttachmentStorage } from '@/attachments/domain/services/attachment-storage';

export interface GetAttachmentUriDependencies {
  attachmentStorage: AttachmentStorage;
}

export class GetAttachmentUriUseCase {
  private readonly attachmentStorage: AttachmentStorage;

  constructor({ attachmentStorage }: GetAttachmentUriDependencies) {
    this.attachmentStorage = attachmentStorage;
  }

  execute(fileUri: string): string | null {
    return this.attachmentStorage.resolveUri(fileUri);
  }
}
