// Caso de uso de aplicación: crea y guarda una categoría del usuario.
// Impide crear categorías del sistema; sin él, presentación podría decidir ids, fechas o permisos.

import { Category, type CreateCategoryData } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';

export interface CreateCategoryDependencies {
  categoryRepository: CategoryRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export class CreateCategoryUseCase {
  private readonly categoryRepository: CategoryRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor({
    categoryRepository,
    idGenerator,
    clock,
  }: CreateCategoryDependencies) {
    this.categoryRepository = categoryRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(input: CreateCategoryData): Promise<Category> {
    const category = Category.create({
      ...input,
      id: this.idGenerator.generate(),
      isSystem: false,
      createdAt: this.clock.today(),
    });

    await this.categoryRepository.save(category);
    return category;
  }
}
