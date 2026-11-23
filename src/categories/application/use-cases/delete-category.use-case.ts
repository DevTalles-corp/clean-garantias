// Caso de uso de aplicación: borra una categoría del usuario que no está en uso.
// Protege las categorías del sistema y las usadas; sin él, habría productos sin categoría.

import { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { ConflictError, NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface DeleteCategoryDependencies {
  categoryRepository: CategoryRepository;
  productRepository: ProductRepository;
}

export class DeleteCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;
  private readonly productRepository: ProductRepository;

  constructor({
    categoryRepository,
    productRepository,
  }: DeleteCategoryDependencies) {
    this.categoryRepository = categoryRepository;
    this.productRepository = productRepository;
  }

  async execute(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(Category.normalizeId(id));
    if (!category) throw new NotFoundError('Categoría no encontrada.');

    if (category.isSystem) {
      throw new ConflictError('No se puede borrar una categoría del sistema.');
    }
    if ((await this.productRepository.findByCategoryId(category.id)).length > 0) {
      throw new ConflictError('No se puede borrar una categoría con productos.');
    }

    await this.categoryRepository.delete(category.id);
  }
}
