// Caso de uso de aplicación: obtiene los productos de una tienda.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { Store } from '@/stores/domain/entities/store.entity';

export interface FindProductsByStoreDependencies {
  productRepository: ProductRepository;
}

export class FindProductsByStoreUseCase {
  private readonly productRepository: ProductRepository;

  constructor({ productRepository }: FindProductsByStoreDependencies) {
    this.productRepository = productRepository;
  }

  async execute(storeId: string): Promise<Product[]> {
    return this.productRepository.findByStoreId(Store.normalizeId(storeId));
  }
}
