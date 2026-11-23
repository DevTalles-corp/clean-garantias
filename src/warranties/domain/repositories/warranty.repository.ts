// Contrato del dominio WarrantyRepository: define cómo consultar, guardar y borrar las garantías sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.
// El estado es derivado, así que no se consulta por él: se calcula con getWarrantyStatus.

import type { Warranty } from '@/warranties/domain/entities/warranty.entity';

export interface WarrantyRepository {
  findById(id: string): Promise<Warranty | undefined>;
  findAll(): Promise<Warranty[]>;
  findByProductId(productId: string): Promise<Warranty[]>;
  save(warranty: Warranty): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
