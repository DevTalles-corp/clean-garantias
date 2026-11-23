// Caso de uso de aplicación: borra los datos de un adjunto, no su archivo físico.
// Avisa si no existe; sin él, presentación dependería del repositorio.

import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface DeleteAttachmentDependencies {
  attachmentRepository: AttachmentRepository;
}

export class DeleteAttachmentUseCase {
  private readonly attachmentRepository: AttachmentRepository;

  constructor({ attachmentRepository }: DeleteAttachmentDependencies) {
    this.attachmentRepository = attachmentRepository;
  }

  async execute(id: string): Promise<void> {
    const attachment = await this.attachmentRepository.findById(Attachment.normalizeId(id));
    if (!attachment) throw new NotFoundError('Adjunto no encontrado.');
    await this.attachmentRepository.delete(attachment.id);
  }
}
