// Contrato del dominio AttachmentStorage: guarda las copias de los archivos adjuntos.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados al sistema de archivos.

export interface AttachmentStorage {
  save(sourceUri: string, fileName: string): Promise<string>; // ruta relativa
  delete(fileUri: string): Promise<void>; // ignora rutas ajenas o inexistentes
  resolveUri(fileUri: string): string | null; // null si es ajena o no existe
}
