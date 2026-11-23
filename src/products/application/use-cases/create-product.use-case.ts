// Caso de uso de aplicación: crea y guarda un producto con categoría y tienda existentes.
// Comprueba las referencias; sin él, el producto podría apuntar a datos inexistentes.

import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import {
  Product,
  type CreateProductData,
} from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import type { IdGenerator } from '@/shared/domain/services/id-generator';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';

export interface CreateProductDependencies {
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  storeRepository: StoreRepository;
  idGenerator: IdGenerator;
  clock: Clock;
}

export class CreateProductUseCase {
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly storeRepository: StoreRepository;
  private readonly idGenerator: IdGenerator;
  private readonly clock: Clock;

  constructor({
    productRepository,
    categoryRepository,
    storeRepository,
    idGenerator,
    clock,
  }: CreateProductDependencies) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.storeRepository = storeRepository;
    this.idGenerator = idGenerator;
    this.clock = clock;
  }

  async execute(input: CreateProductData): Promise<Product> {
    const product = Product.create({
      ...input,
      id: this.idGenerator.generate(),
      createdAt: this.clock.today(),
    });

    await this.assertReferencesExist(product);
    await this.productRepository.save(product);
    return product;
  }

  private async assertReferencesExist(product: Product): Promise<void> {
    if (!(await this.categoryRepository.findById(product.categoryId))) {
      throw new NotFoundError('Categoría no encontrada.');
    }
    if (
      product.storeId &&
      !(await this.storeRepository.findById(product.storeId))
    ) {
      throw new NotFoundError('Tienda no encontrada.');
    }
  }
}
