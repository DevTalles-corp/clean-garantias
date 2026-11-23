// Caso de uso de aplicación: consulta el permiso de fotos sin mostrar el diálogo.
// Expone la consulta como acción; sin él, presentación dependería de la galería.

import type { PhotoAccess, PhotoLibrary } from '@/attachments/domain/services/photo-library';

export interface GetPhotoAccessDependencies {
  photoLibrary: PhotoLibrary;
}

export class GetPhotoAccessUseCase {
  private readonly photoLibrary: PhotoLibrary;

  constructor({ photoLibrary }: GetPhotoAccessDependencies) {
    this.photoLibrary = photoLibrary;
  }

  async execute(): Promise<PhotoAccess> {
    return this.photoLibrary.getAccess();
  }
}
