// Caso de uso de aplicación: actualiza los datos de una tienda.
// Conserva id y fecha de creación; sin él, una edición podría alterarlos.

import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import { Store, type CreateStoreData } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export interface UpdateStoreDependencies {
  storeRepository: StoreRepository;
}

export class UpdateStoreUseCase {
  private readonly storeRepository: StoreRepository;

  constructor({ storeRepository }: UpdateStoreDependencies) {
    this.storeRepository = storeRepository;
  }

  async execute(id: string, changes: Partial<CreateStoreData>): Promise<Store> {
    const current = await this.storeRepository.findById(Store.normalizeId(id));
    if (!current) throw new NotFoundError('Tienda no encontrada.');

    // Un campo opcional enviado como undefined se borra.
    const store = Store.create({
      ...current,
      ...changes,
      id: current.id,
      createdAt: current.createdAt,
    });

    await this.storeRepository.save(store);
    return store;
  }
}
