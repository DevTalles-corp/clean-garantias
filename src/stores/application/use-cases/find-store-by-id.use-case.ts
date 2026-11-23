// Caso de uso de aplicación: busca una tienda por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import { Store } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export interface FindStoreByIdDependencies {
  storeRepository: StoreRepository;
}

export class FindStoreByIdUseCase {
  private readonly storeRepository: StoreRepository;

  constructor({ storeRepository }: FindStoreByIdDependencies) {
    this.storeRepository = storeRepository;
  }

  async execute(id: string): Promise<Store> {
    const store = await this.storeRepository.findById(Store.normalizeId(id));
    if (!store) throw new NotFoundError('Tienda no encontrada.');
    return store;
  }
}
