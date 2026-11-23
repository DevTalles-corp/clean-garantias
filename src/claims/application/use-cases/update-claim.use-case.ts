// Caso de uso de aplicación: actualiza los datos o el estado de un reclamo.
// Reúne búsqueda, validación y fecha; sin él, presentación repetiría esos pasos.

import { Claim, type UpdateClaimData } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';

export interface UpdateClaimDependencies {
  claimRepository: ClaimRepository;
  clock: Clock;
}

export class UpdateClaimUseCase {
  private readonly claimRepository: ClaimRepository;
  private readonly clock: Clock;

  constructor({ claimRepository, clock }: UpdateClaimDependencies) {
    this.claimRepository = claimRepository;
    this.clock = clock;
  }

  async execute(id: string, changes: UpdateClaimData): Promise<Claim> {
    const current = await this.claimRepository.findById(Claim.normalizeId(id));
    if (!current) throw new NotFoundError('Reclamo no encontrado.');

    const claim = current.update(changes, this.clock.today());

    await this.claimRepository.save(claim);
    return claim;
  }
}
