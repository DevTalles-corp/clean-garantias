// Caso de uso de aplicación: obtiene los productos de una tienda.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { Store } from '@/stores/domain/entities/store.entity';

export class FindProductsByStoreUseCase {
  private readonly repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(storeId: string): Promise<Product[]> {
    return this.repository.findByStoreId(Store.normalizeId(storeId));
  }
}
