// Caso de uso de aplicación: obtiene todas las tiendas.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Store } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export class FindAllStoresUseCase {
  private readonly repository: StoreRepository;

  constructor(repository: StoreRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Store[]> {
    return this.repository.findAll();
  }
}
