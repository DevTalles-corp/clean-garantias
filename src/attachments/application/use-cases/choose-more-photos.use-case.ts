// Caso de uso de aplicación: abre el selector de fotos del acceso limitado.
// Expone el selector como acción; sin él, presentación dependería de la galería.

import type { PhotoLibrary } from '@/attachments/domain/services/photo-library';

export interface ChooseMorePhotosDependencies {
  photoLibrary: PhotoLibrary;
}

export class ChooseMorePhotosUseCase {
  private readonly photoLibrary: PhotoLibrary;

  constructor({ photoLibrary }: ChooseMorePhotosDependencies) {
    this.photoLibrary = photoLibrary;
  }

  async execute(): Promise<void> {
    return this.photoLibrary.chooseMore();
  }
}
