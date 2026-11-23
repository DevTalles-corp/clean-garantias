// Caso de uso de aplicación: busca una categoría por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface FindCategoryByIdDependencies {
  categoryRepository: CategoryRepository;
}

export class FindCategoryByIdUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor({ categoryRepository }: FindCategoryByIdDependencies) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id: string): Promise<Category> {
    const category = await this.categoryRepository.findById(Category.normalizeId(id));
    if (!category) throw new NotFoundError('Categoría no encontrada.');
    return category;
  }
}
