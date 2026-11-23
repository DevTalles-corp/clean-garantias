// Caso de uso de aplicación: borra una garantía con sus recordatorios, reclamos y adjuntos.
// Coordina la cascada de dependientes a raíz; sin él, quedarían datos huérfanos. Si falla, se puede reintentar.

import type { AttachmentOwner } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import type { ReminderRepository } from '@/reminders/domain/repositories/reminder.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export interface DeleteWarrantyDependencies {
  warrantyRepository: WarrantyRepository;
  reminderRepository: ReminderRepository;
  claimRepository: ClaimRepository;
  attachmentRepository: AttachmentRepository;
}

export class DeleteWarrantyUseCase {
  private readonly warrantyRepository: WarrantyRepository;
  private readonly reminderRepository: ReminderRepository;
  private readonly claimRepository: ClaimRepository;
  private readonly attachmentRepository: AttachmentRepository;

  constructor({
    warrantyRepository,
    reminderRepository,
    claimRepository,
    attachmentRepository,
  }: DeleteWarrantyDependencies) {
    this.warrantyRepository = warrantyRepository;
    this.reminderRepository = reminderRepository;
    this.claimRepository = claimRepository;
    this.attachmentRepository = attachmentRepository;
  }

  async execute(id: string): Promise<void> {
    const warranty = await this.warrantyRepository.findById(Warranty.normalizeId(id));
    if (!warranty) throw new NotFoundError('Garantía no encontrada.');

    for (const reminder of await this.reminderRepository.findByWarrantyId(warranty.id)) {
      await this.reminderRepository.delete(reminder.id);
    }
    for (const claim of await this.claimRepository.findByWarrantyId(warranty.id)) {
      await this.deleteAttachments('claim', claim.id);
      await this.claimRepository.delete(claim.id);
    }
    await this.deleteAttachments('warranty', warranty.id);

    await this.warrantyRepository.delete(warranty.id);
  }

  private async deleteAttachments(ownerType: AttachmentOwner, ownerId: string): Promise<void> {
    for (const attachment of await this.attachmentRepository.findByOwner(ownerType, ownerId)) {
      await this.attachmentRepository.delete(attachment.id);
    }
  }
}
