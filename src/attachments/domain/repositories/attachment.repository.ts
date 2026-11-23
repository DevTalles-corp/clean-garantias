// Contrato del dominio AttachmentRepository: define cómo consultar, guardar y borrar los adjuntos sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.
// Guarda los datos del adjunto, no el archivo físico.

import type { Attachment, AttachmentOwner } from '@/attachments/domain/entities/attachment.entity';

export interface AttachmentRepository {
  findById(id: string): Promise<Attachment | undefined>;
  findByOwner(ownerType: AttachmentOwner, ownerId: string): Promise<Attachment[]>;
  save(attachment: Attachment): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
