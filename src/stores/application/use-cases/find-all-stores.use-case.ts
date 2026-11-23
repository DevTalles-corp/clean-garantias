// Caso de uso de aplicación: obtiene todas las tiendas.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Store } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export interface FindAllStoresDependencies {
  storeRepository: StoreRepository;
}

export class FindAllStoresUseCase {
  private readonly storeRepository: StoreRepository;

  constructor({ storeRepository }: FindAllStoresDependencies) {
    this.storeRepository = storeRepository;
  }

  async execute(): Promise<Store[]> {
    return this.storeRepository.findAll();
  }
}
