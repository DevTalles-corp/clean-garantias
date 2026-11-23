// Caso de uso de aplicación: obtiene los productos de una categoría.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import { Category } from '@/categories/domain/entities/category.entity';
import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';

export class FindProductsByCategoryUseCase {
  private readonly repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(categoryId: string): Promise<Product[]> {
    return this.repository.findByCategoryId(Category.normalizeId(categoryId));
  }
}
