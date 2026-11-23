// Variante web de ExpoPhotoLibrary: el navegador no da acceso a la galería.

import type {
  LibraryPhoto,
  PhotoAccess,
  PhotoLibrary,
  PickedPhoto,
} from '@/attachments/domain/services/photo-library';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class ExpoPhotoLibrary implements PhotoLibrary {
  async getAccess(): Promise<PhotoAccess> {
    return 'unavailable';
  }

  async requestAccess(): Promise<PhotoAccess> {
    return 'unavailable';
  }

  async chooseMore(): Promise<void> {}

  async findRecent(): Promise<LibraryPhoto[]> {
    return [];
  }

  async getPhoto(): Promise<PickedPhoto> {
    throw new NotFoundError('La galería no está disponible en web.');
  }
}
