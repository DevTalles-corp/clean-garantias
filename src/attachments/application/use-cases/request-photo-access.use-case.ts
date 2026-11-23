// Caso de uso de aplicación: pide al usuario el permiso de fotos.
// Expone la petición como acción; sin él, presentación dependería de la galería.

import type { PhotoAccess, PhotoLibrary } from '@/attachments/domain/services/photo-library';

export interface RequestPhotoAccessDependencies {
  photoLibrary: PhotoLibrary;
}

export class RequestPhotoAccessUseCase {
  private readonly photoLibrary: PhotoLibrary;

  constructor({ photoLibrary }: RequestPhotoAccessDependencies) {
    this.photoLibrary = photoLibrary;
  }

  async execute(): Promise<PhotoAccess> {
    return this.photoLibrary.requestAccess();
  }
}
