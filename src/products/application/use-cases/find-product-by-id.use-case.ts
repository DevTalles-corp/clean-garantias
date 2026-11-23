// Caso de uso de aplicación: busca un producto por su id y avisa si no existe.
// Concentra esa regla; sin él, cada pantalla decidiría qué hacer ante un id inexistente.

import { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';

export class FindProductByIdUseCase {
  private readonly repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Product> {
    const product = await this.repository.findById(Product.normalizeId(id));
    if (!product) throw new NotFoundError('Producto no encontrado.');
    return product;
  }
}
