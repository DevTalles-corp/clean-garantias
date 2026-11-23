// Caso de uso de aplicación: obtiene los reclamos de una garantía.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Claim } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';

export class FindClaimsByWarrantyUseCase {
  private readonly repository: ClaimRepository;

  constructor(repository: ClaimRepository) {
    this.repository = repository;
  }

  async execute(warrantyId: string): Promise<Claim[]> {
    return this.repository.findByWarrantyId(Warranty.normalizeId(warrantyId));
  }
}
