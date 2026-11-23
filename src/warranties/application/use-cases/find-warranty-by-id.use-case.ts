// Caso de uso de aplicación: busca una garantía por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class FindWarrantyByIdUseCase {
  private readonly repository: WarrantyRepository;

  constructor(repository: WarrantyRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Warranty> {
    const warranty = await this.repository.findById(Warranty.normalizeId(id));
    if (!warranty) throw new NotFoundError('Garantía no encontrada.');
    return warranty;
  }
}
