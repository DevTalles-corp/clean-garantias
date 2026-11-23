// Caso de uso de aplicación: guarda las categorías iniciales del sistema si aún no existen.
// Permite ejecutarlo en cada arranque; sin él, la semilla se duplicaría.

import { Category, type CreateCategoryData } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';

export interface SeedCategoriesDependencies {
  categoryRepository: CategoryRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export class SeedCategoriesUseCase {
  private readonly categoryRepository: CategoryRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor({
    categoryRepository,
    idGenerator,
    clock,
  }: SeedCategoriesDependencies) {
    this.categoryRepository = categoryRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(inputs: readonly CreateCategoryData[]): Promise<void> {
    // Valida toda la semilla antes de guardar.
    const seeds = inputs.map((input) =>
      Category.create({
        ...input,
        id: this.idGenerator.generate(),
        isSystem: true,
        createdAt: this.clock.today(),
      }),
    );

    // Compara por nombre: una semilla interrumpida se completa en el siguiente arranque.
    const existing = await this.categoryRepository.findAll();
    const names = new Set(
      existing.filter((category) => category.isSystem).map((category) => category.name),
    );

    for (const seed of seeds) {
      if (names.has(seed.name)) continue;
      await this.categoryRepository.save(seed);
      names.add(seed.name);
    }
  }
}
