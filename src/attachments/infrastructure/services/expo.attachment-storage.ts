// Implementación ExpoAttachmentStorage: guarda copias en la carpeta de documentos con expo-file-system.
// Usa rutas relativas porque la carpeta de la app puede cambiar al actualizarla en iOS.

import { Directory, File, Paths } from 'expo-file-system';

import type { AttachmentStorage } from '@/attachments/domain/services/attachment-storage';
import type { IdGenerator } from '@/shared/domain/services/id-generator';

const folder = 'receipts';
const ownPath = /^receipts\/[a-z0-9-]+\.[a-z0-9]+$/i;

export class ExpoAttachmentStorage implements AttachmentStorage {
  private readonly idGenerator: IdGenerator;

  constructor(idGenerator: IdGenerator) {
    this.idGenerator = idGenerator;
  }

  async save(sourceUri: string, fileName: string): Promise<string> {
    const extension = /\.([a-z0-9]+)$/i.exec(fileName)?.[1].toLowerCase() ?? 'jpg';
    const fileUri = `${folder}/${this.idGenerator.generate()}.${extension}`;
    const copy = new File(Paths.document, fileUri);

    new Directory(Paths.document, folder).create({ intermediates: true, idempotent: true });
    try {
      await new File(sourceUri).copy(copy);
    } catch (error) {
      await this.delete(fileUri).catch(() => undefined); // copia a medias
      throw error;
    }
    return fileUri;
  }

  async delete(fileUri: string): Promise<void> {
    const file = this.findFile(fileUri);
    if (file) file.delete();
  }

  resolveUri(fileUri: string): string | null {
    return this.findFile(fileUri)?.uri ?? null;
  }

  private findFile(fileUri: string): File | null {
    if (!ownPath.test(fileUri)) return null;
    const file = new File(Paths.document, fileUri);
    return file.exists ? file : null;
  }
}
