// Contrato del dominio PhotoLibrary: consulta las fotos del dispositivo y el permiso para verlas.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a la galería de Expo.

export type PhotoAccess = 'all' | 'limited' | 'denied' | 'blocked' | 'unavailable';

export interface LibraryPhoto {
  id: string;
  previewUri: string; // ph:// en iOS, content:// en Android
}

export interface PickedPhoto {
  uri: string;
  fileName: string;
  mimeType: string; // vacío si no se reconoce
  sizeBytes: number;
}

export interface PhotoLibrary {
  getAccess(): Promise<PhotoAccess>; // no muestra el diálogo
  requestAccess(): Promise<PhotoAccess>;
  chooseMore(): Promise<void>; // selector de acceso limitado
  findRecent(limit: number, offset: number): Promise<LibraryPhoto[]>;
  getPhoto(id: string): Promise<PickedPhoto>;
}
