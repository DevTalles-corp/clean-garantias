// Caso de uso de aplicación: busca un reclamo por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { Claim } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface FindClaimByIdDependencies {
  claimRepository: ClaimRepository;
}

export class FindClaimByIdUseCase {
  private readonly claimRepository: ClaimRepository;

  constructor({ claimRepository }: FindClaimByIdDependencies) {
    this.claimRepository = claimRepository;
  }

  async execute(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findById(Claim.normalizeId(id));
    if (!claim) throw new NotFoundError('Reclamo no encontrado.');
    return claim;
  }
}
