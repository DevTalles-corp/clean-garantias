// Caso de uso de aplicación: registra un adjunto de un producto, garantía o reclamo existente.
// Comprueba el dueño, que SQLite no puede validar; sin él, habría adjuntos huérfanos.

import { Attachment, type CreateAttachmentData } from '@/attachments/domain/entities/attachment.entity';
import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export interface CreateAttachmentDependencies {
  attachmentRepository: AttachmentRepository;
  productRepository: ProductRepository;
  warrantyRepository: WarrantyRepository;
  claimRepository: ClaimRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export class CreateAttachmentUseCase {
  private readonly attachmentRepository: AttachmentRepository;
  private readonly productRepository: ProductRepository;
  private readonly warrantyRepository: WarrantyRepository;
  private readonly claimRepository: ClaimRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor({
    attachmentRepository,
    productRepository,
    warrantyRepository,
    claimRepository,
    idGenerator,
    clock,
  }: CreateAttachmentDependencies) {
    this.attachmentRepository = attachmentRepository;
    this.productRepository = productRepository;
    this.warrantyRepository = warrantyRepository;
    this.claimRepository = claimRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(input: CreateAttachmentData): Promise<Attachment> {
    const attachment = Attachment.create({
      ...input,
      id: this.idGenerator.generate(),
      createdAt: this.clock.today(),
    });

    if (!(await this.findOwner(attachment))) {
      throw new NotFoundError('Dueño del adjunto no encontrado.');
    }

    await this.attachmentRepository.save(attachment);
    return attachment;
  }

  private findOwner({ ownerType, ownerId }: Attachment): Promise<object | undefined> {
    switch (ownerType) {
      case 'product':
        return this.productRepository.findById(ownerId);
      case 'warranty':
        return this.warrantyRepository.findById(ownerId);
      case 'claim':
        return this.claimRepository.findById(ownerId);
    }
  }
}
