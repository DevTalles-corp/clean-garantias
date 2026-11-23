// Caso de uso de aplicación: borra un producto con sus garantías y adjuntos.
// Coordina la cascada de dependientes a raíz; sin él, quedarían datos huérfanos. Si falla, se puede reintentar.

import type { AttachmentRepository } from '@/attachments/domain/repositories/attachment.repository';
import { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import { NotFoundError } from '@/shared/domain/errors/domain.errors';
import type { DeleteWarrantyUseCase } from '@/warranties/application/use-cases/delete-warranty.use-case';
import type { WarrantyRepository } from '@/warranties/domain/repositories/warranty.repository';

export class DeleteProductUseCase {
  private readonly productRepository: ProductRepository;
  private readonly warrantyRepository: WarrantyRepository;
  private readonly attachmentRepository: AttachmentRepository;
  private readonly deleteWarranty: DeleteWarrantyUseCase;

  constructor(
    productRepository: ProductRepository,
    warrantyRepository: WarrantyRepository,
    attachmentRepository: AttachmentRepository,
    deleteWarranty: DeleteWarrantyUseCase,
  ) {
    this.productRepository = productRepository;
    this.warrantyRepository = warrantyRepository;
    this.attachmentRepository = attachmentRepository;
    this.deleteWarranty = deleteWarranty;
  }

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(Product.normalizeId(id));
    if (!product) throw new NotFoundError('Producto no encontrado.');

    for (const warranty of await this.warrantyRepository.findByProductId(product.id)) {
      await this.deleteWarranty.execute(warranty.id);
    }
    for (const attachment of await this.attachmentRepository.findByOwner('product', product.id)) {
      await this.attachmentRepository.delete(attachment.id);
    }

    await this.productRepository.delete(product.id);
  }
}
