// Caso de uso de aplicación: obtiene todas las categorías.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';

export class FindAllCategoriesUseCase {
  private readonly repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Category[]> {
    return this.repository.findAll();
  }
}
