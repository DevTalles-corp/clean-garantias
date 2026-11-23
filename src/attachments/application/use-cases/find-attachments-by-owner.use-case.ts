// Caso de uso de aplicación: obtiene los adjuntos de un producto, garantía o reclamo.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import { Attachment, type AttachmentOwner } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';

export class FindAttachmentsByOwnerUseCase {
  private readonly repository: AttachmentRepository;

  constructor(repository: AttachmentRepository) {
    this.repository = repository;
  }

  async execute(ownerType: AttachmentOwner, ownerId: string): Promise<Attachment[]> {
    return this.repository.findByOwner(ownerType, Attachment.normalizeId(ownerId));
  }
}
