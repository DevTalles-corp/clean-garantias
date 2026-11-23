// Caso de uso de aplicación: obtiene los adjuntos de un producto, garantía o reclamo.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import { Attachment, type AttachmentOwner } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';

export interface FindAttachmentsByOwnerDependencies {
  attachmentRepository: AttachmentRepository;
}

export class FindAttachmentsByOwnerUseCase {
  private readonly attachmentRepository: AttachmentRepository;

  constructor({ attachmentRepository }: FindAttachmentsByOwnerDependencies) {
    this.attachmentRepository = attachmentRepository;
  }

  async execute(ownerType: AttachmentOwner, ownerId: string): Promise<Attachment[]> {
    return this.attachmentRepository.findByOwner(ownerType, Attachment.normalizeId(ownerId));
  }
}
