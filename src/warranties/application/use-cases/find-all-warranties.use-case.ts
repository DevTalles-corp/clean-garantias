// Caso de uso de aplicación: obtiene todas las garantías.
// Expone la lectura como acción; sin él, presentación dependería del repositorio.

import type { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export interface FindAllWarrantiesDependencies {
  warrantyRepository: WarrantyRepository;
}

export class FindAllWarrantiesUseCase {
  private readonly warrantyRepository: WarrantyRepository;

  constructor({ warrantyRepository }: FindAllWarrantiesDependencies) {
    this.warrantyRepository = warrantyRepository;
  }

  async execute(): Promise<Warranty[]> {
    return this.warrantyRepository.findAll();
  }
}
