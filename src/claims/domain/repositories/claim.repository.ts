// Contrato del dominio ClaimRepository: define cómo consultar, guardar y borrar los reclamos sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.

import type { Claim } from '@/claims/domain/entities/claim.entity';

export interface ClaimRepository {
  findById(id: string): Promise<Claim | undefined>;
  findByWarrantyId(warrantyId: string): Promise<Claim[]>;
  save(claim: Claim): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
