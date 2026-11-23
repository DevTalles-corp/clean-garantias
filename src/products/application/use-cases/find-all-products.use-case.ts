// Caso de uso de aplicación: obtiene todos los productos.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';

export class FindAllProductsUseCase {
  private readonly repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Product[]> {
    return this.repository.findAll();
  }
}
