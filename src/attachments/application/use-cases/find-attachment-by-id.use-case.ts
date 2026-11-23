// Caso de uso de aplicación: busca un adjunto por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class FindAttachmentByIdUseCase {
  private readonly repository: AttachmentRepository;

  constructor(repository: AttachmentRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Attachment> {
    const attachment = await this.repository.findById(Attachment.normalizeId(id));
    if (!attachment) throw new NotFoundError('Adjunto no encontrado.');
    return attachment;
  }
}
