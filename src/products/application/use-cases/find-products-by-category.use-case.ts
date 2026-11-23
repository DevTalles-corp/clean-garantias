// Caso de uso de aplicación: obtiene los productos de una categoría.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import { Category } from '@/categories/domain/entities/category.entity';
import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';

export interface FindProductsByCategoryDependencies {
  productRepository: ProductRepository;
}

export class FindProductsByCategoryUseCase {
  private readonly productRepository: ProductRepository;

  constructor({ productRepository }: FindProductsByCategoryDependencies) {
    this.productRepository = productRepository;
  }

  async execute(categoryId: string): Promise<Product[]> {
    return this.productRepository.findByCategoryId(Category.normalizeId(categoryId));
  }
}
