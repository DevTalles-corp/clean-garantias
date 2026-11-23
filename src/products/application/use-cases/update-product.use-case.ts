// Caso de uso de aplicación: actualiza un producto y revisa sus referencias y garantías.
// Coordina varias entidades; sin él, una garantía podría iniciar antes de la nueva fecha de compra.

import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import { Product, type CreateProductData } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { Clock } from '@/shared/domain/services/clock';
import type { StoreRepository } from '@/stores/domain/repositories/store.repository';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export interface UpdateProductDependencies {
  productRepository: ProductRepository;
  categoryRepository: CategoryRepository;
  storeRepository: StoreRepository;
  warrantyRepository: WarrantyRepository;
  clock: Clock;
}

export class UpdateProductUseCase {
  private readonly productRepository: ProductRepository;
  private readonly categoryRepository: CategoryRepository;
  private readonly storeRepository: StoreRepository;
  private readonly warrantyRepository: WarrantyRepository;
  private readonly clock: Clock;

  constructor({
    productRepository,
    categoryRepository,
    storeRepository,
    warrantyRepository,
    clock,
  }: UpdateProductDependencies) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
    this.storeRepository = storeRepository;
    this.warrantyRepository = warrantyRepository;
    this.clock = clock;
  }

  async execute(id: string, changes: Partial<CreateProductData>): Promise<Product> {
    const current = await this.productRepository.findById(Product.normalizeId(id));
    if (!current) throw new NotFoundError('Producto no encontrado.');

    const product = current.update(changes, this.clock.today());
    await this.assertReferencesExist(product);

    if (product.purchaseDate !== current.purchaseDate) {
      const warranties = await this.warrantyRepository.findByProductId(product.id);
      warranties.forEach((warranty) => warranty.assertStartsAfterPurchase(product.purchaseDate));
    }

    await this.productRepository.save(product);
    return product;
  }

  private async assertReferencesExist(product: Product): Promise<void> {
    if (!(await this.categoryRepository.findById(product.categoryId))) {
      throw new NotFoundError('Categoría no encontrada.');
    }
    if (product.storeId && !(await this.storeRepository.findById(product.storeId))) {
      throw new NotFoundError('Tienda no encontrada.');
    }
  }
}
