// Caso de uso de aplicación: obtiene todos los productos.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';

export interface FindAllProductsDependencies {
  productRepository: ProductRepository;
}

export class FindAllProductsUseCase {
  private readonly productRepository: ProductRepository;

  constructor({ productRepository }: FindAllProductsDependencies) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
