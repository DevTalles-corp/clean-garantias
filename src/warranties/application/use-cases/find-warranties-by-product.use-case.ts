// Caso de uso de aplicación: obtiene las garantías de un producto.
// Expone la consulta como acción; sin él, presentación dependería del repositorio.

import { Product } from '@/products/domain/entities/product.entity';
import type { Warranty } from '@/warranties/domain/entities/warranty.entity';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class FindWarrantiesByProductUseCase {
  private readonly repository: WarrantyRepository;

  constructor(repository: WarrantyRepository) {
    this.repository = repository;
  }

  async execute(productId: string): Promise<Warranty[]> {
    return this.repository.findByProductId(Product.normalizeId(productId));
  }
}
