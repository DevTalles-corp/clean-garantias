// Caso de uso de aplicación: actualiza una categoría del usuario.
// Protege las categorías del sistema; sin él, renombrar una haría que la semilla la duplicara.

import { Category, type CreateCategoryData } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { ConflictError, NotFoundError } from '@/shared/domain/errors/domain.errors';

export interface UpdateCategoryDependencies {
  categoryRepository: CategoryRepository;
}

export class UpdateCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;

  constructor({ categoryRepository }: UpdateCategoryDependencies) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id: string, changes: Partial<CreateCategoryData>): Promise<Category> {
    const current = await this.categoryRepository.findById(Category.normalizeId(id));
    if (!current) throw new NotFoundError('Categoría no encontrada.');
    if (current.isSystem) {
      throw new ConflictError('No se puede modificar una categoría del sistema.');
    }

    const category = Category.create({
      ...current,
      ...changes,
      id: current.id,
      isSystem: current.isSystem,
      createdAt: current.createdAt,
    });

    await this.categoryRepository.save(category);
    return category;
  }
}
