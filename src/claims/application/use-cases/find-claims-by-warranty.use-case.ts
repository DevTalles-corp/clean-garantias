// Caso de uso de aplicación: obtiene los reclamos de una garantía.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Claim } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';

export interface FindClaimsByWarrantyDependencies {
  claimRepository: ClaimRepository;
}

export class FindClaimsByWarrantyUseCase {
  private readonly claimRepository: ClaimRepository;

  constructor({ claimRepository }: FindClaimsByWarrantyDependencies) {
    this.claimRepository = claimRepository;
  }

  async execute(warrantyId: string): Promise<Claim[]> {
    return this.claimRepository.findByWarrantyId(Warranty.normalizeId(warrantyId));
  }
}
