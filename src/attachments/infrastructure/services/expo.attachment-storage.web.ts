// Variante web de ExpoAttachmentStorage: el navegador no guarda archivos de la app.

import type { AttachmentStorage } from '@/attachments/domain/services/attachment-storage';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class ExpoAttachmentStorage implements AttachmentStorage {
  async save(): Promise<string> {
    throw new NotFoundError('Guardar archivos no está disponible en web.');
  }

  async delete(): Promise<void> {}

  resolveUri(): string | null {
    return null;
  }
}
