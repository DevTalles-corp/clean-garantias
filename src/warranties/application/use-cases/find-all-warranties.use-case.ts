// Caso de uso de aplicación: obtiene todas las garantías.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class FindAllWarrantiesUseCase {
  private readonly repository: WarrantyRepository;

  constructor(repository: WarrantyRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Warranty[]> {
    return this.repository.findAll();
  }
}
