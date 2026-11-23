// Caso de uso de aplicación: abre un reclamo sobre una garantía vigente.
// Aporta el vencimiento de la garantía; sin él, la entidad no podría rechazar reclamos tardíos.

import { Claim, type CreateClaimData } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export interface CreateClaimDependencies {
  claimRepository: ClaimRepository;
  warrantyRepository: WarrantyRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export class CreateClaimUseCase {
  private readonly claimRepository: ClaimRepository;
  private readonly warrantyRepository: WarrantyRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor({
    claimRepository,
    warrantyRepository,
    idGenerator,
    clock,
  }: CreateClaimDependencies) {
    this.claimRepository = claimRepository;
    this.warrantyRepository = warrantyRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(input: CreateClaimData): Promise<Claim> {
    const warranty = await this.warrantyRepository.findById(Warranty.normalizeId(input.warrantyId));
    if (!warranty) throw new NotFoundError('Garantía no encontrada.');

    const claim = Claim.create({
      ...input,
      id: this.idGenerator.generate(),
      warrantyId: warranty.id,
      warrantyEndDate: warranty.endDate,
      openedAt: this.clock.today(),
    });

    await this.claimRepository.save(claim);
    return claim;
  }
}
