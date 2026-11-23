// Contrato del dominio StoreRepository: define cómo consultar, guardar y borrar las tiendas sin elegir una tecnología.
// Invierte la dependencia; sin él, los casos de uso quedarían acoplados a un almacenamiento concreto.

import type { Store } from '@/stores/domain/entities/store.entity';

export interface StoreRepository {
  findById(id: string): Promise<Store | undefined>;
  findAll(): Promise<Store[]>;
  save(store: Store): Promise<void>; // crea o reemplaza según el id
  delete(id: string): Promise<void>;
}
