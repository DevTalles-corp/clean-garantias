// Caso de uso de aplicación: lista una página de fotos, de más nueva a más antigua.
// Expone la consulta como acción; sin él, presentación dependería de la galería.

import type { LibraryPhoto, PhotoLibrary } from '@/attachments/domain/services/photo-library';

export interface FindRecentPhotosDependencies {
  photoLibrary: PhotoLibrary;
}

export class FindRecentPhotosUseCase {
  private readonly photoLibrary: PhotoLibrary;

  constructor({ photoLibrary }: FindRecentPhotosDependencies) {
    this.photoLibrary = photoLibrary;
  }

  async execute(limit: number, offset: number): Promise<LibraryPhoto[]> {
    return this.photoLibrary.findRecent(limit, offset);
  }
}
