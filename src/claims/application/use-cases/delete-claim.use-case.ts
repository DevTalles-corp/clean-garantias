// Caso de uso de aplicación: borra un reclamo con sus adjuntos.
// Coordina ambos borrados; sin él, quedarían adjuntos huérfanos.

import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import { Claim } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface DeleteClaimDependencies {
  claimRepository: ClaimRepository;
  attachmentRepository: AttachmentRepository;
}

export class DeleteClaimUseCase {
  private readonly claimRepository: ClaimRepository;
  private readonly attachmentRepository: AttachmentRepository;

  constructor({
    claimRepository,
    attachmentRepository,
  }: DeleteClaimDependencies) {
    this.claimRepository = claimRepository;
    this.attachmentRepository = attachmentRepository;
  }

  async execute(id: string): Promise<void> {
    const claim = await this.claimRepository.findById(Claim.normalizeId(id));
    if (!claim) throw new NotFoundError('Reclamo no encontrado.');

    for (const attachment of await this.attachmentRepository.findByOwner('claim', claim.id)) {
      await this.attachmentRepository.delete(attachment.id);
    }

    await this.claimRepository.delete(claim.id);
  }
}
