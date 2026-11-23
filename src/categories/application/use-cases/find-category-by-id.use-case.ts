// Caso de uso de aplicación: busca una categoría por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class FindCategoryByIdUseCase {
  private readonly repository: CategoryRepository;

  constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Category> {
    const category = await this.repository.findById(Category.normalizeId(id));
    if (!category) throw new NotFoundError('Categoría no encontrada.');
    return category;
  }
}
