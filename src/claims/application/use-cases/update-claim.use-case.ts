// Caso de uso de aplicación: actualiza los datos o el estado de un reclamo.
// Reúne búsqueda, validación y fecha; sin él, presentación repetiría esos pasos.

import { Claim, type UpdateClaimData } from '@/claims/domain/entities/claim.entity';
import type { ClaimRepository } from '@/claims/domain/repositories/claim.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';

export class UpdateClaimUseCase {
  private readonly repository: ClaimRepository;
  private readonly clock: Clock;

  constructor(repository: ClaimRepository, clock: Clock) {
    this.repository = repository;
    this.clock = clock;
  }

  async execute(id: string, changes: UpdateClaimData): Promise<Claim> {
    const current = await this.repository.findById(Claim.normalizeId(id));
    if (!current) throw new NotFoundError('Reclamo no encontrado.');

    const claim = current.update(changes, this.clock.today());

    await this.repository.save(claim);
    return claim;
  }
}
