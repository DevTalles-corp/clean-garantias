// Caso de uso de aplicación: obtiene todas las categorías.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';

export interface FindAllCategoriesDependencies {
  categoryRepository: CategoryRepository;
}

export class FindAllCategoriesUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor({ categoryRepository }: FindAllCategoriesDependencies) {
    this.categoryRepository = categoryRepository;
  }

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
