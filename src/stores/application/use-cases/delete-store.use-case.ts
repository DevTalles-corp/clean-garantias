// Caso de uso de aplicación: borra una tienda que no está en uso.
// Protege las tiendas usadas; sin él, habría productos que apuntan a una tienda inexistente.

import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ConflictError, NotFoundError } from '@/shared/domain/errors/domain.errors';
import { Store } from '@/stores/domain/entities/store.entity';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export interface DeleteStoreDependencies {
  storeRepository: StoreRepository;
  productRepository: ProductRepository;
}

export class DeleteStoreUseCase {
  private readonly storeRepository: StoreRepository;
  private readonly productRepository: ProductRepository;

  constructor({ storeRepository, productRepository }: DeleteStoreDependencies) {
    this.storeRepository = storeRepository;
    this.productRepository = productRepository;
  }

  async execute(id: string): Promise<void> {
    const store = await this.storeRepository.findById(Store.normalizeId(id));
    if (!store) throw new NotFoundError('Tienda no encontrada.');

    if ((await this.productRepository.findByStoreId(store.id)).length > 0) {
      throw new ConflictError('No se puede borrar una tienda con productos.');
    }

    await this.storeRepository.delete(store.id);
  }
}
