import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import { DeleteProductUseCase } from '@/products/application/use-cases/delete-product.use-case';
import { Product } from '@/products/domain/entities/product.entity';
import { DeleteWarrantyUseCase } from '@/warranties/application/use-cases/delete-warranty.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  testId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('DeleteProductUseCase', () => {
  let context: TestContext;
  let useCase: DeleteProductUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new DeleteProductUseCase({
      productRepository: context.products,
      warrantyRepository: context.warranties,
      attachmentRepository: context.attachments,
      deleteWarranty: new DeleteWarrantyUseCase({
        warrantyRepository: context.warranties,
        reminderRepository: context.reminders,
        claimRepository: context.claims,
        attachmentRepository: context.attachments,
      }),
    });
  });

  test('borra en cascada todo lo que depende del producto', async () => {
    await context.attachments.save(
      Attachment.create({ ...entities.attachment, id: testId(8), ownerType: 'claim', ownerId: ids.claim }),
    );
    await context.attachments.save(
      Attachment.create({ ...entities.attachment, id: testId(9), ownerType: 'warranty', ownerId: ids.warranty }),
    );

    await useCase.execute(`  ${ids.product.toUpperCase()}  `);

    expect(await context.products.findAll()).toEqual([]);
    expect(await context.warranties.findAll()).toEqual([]);
    expect(await context.reminders.findAll()).toEqual([]);
    expect(await context.claims.findAll()).toEqual([]);
    expect(await context.attachments.findAll()).toEqual([]);
  });

  test('conserva la categoría, la tienda y otros productos', async () => {
    const other = Product.restore({ ...entities.product, id: testId(30) });
    await context.products.save(other);

    await useCase.execute(ids.product);

    expect(await context.products.findAll()).toEqual([other]);
    expect(await context.categories.findAll()).toEqual([entities.category]);
    expect(await context.stores.findAll()).toEqual([entities.store]);
  });

  test('borra el producto al final para poder reintentar si algo falla', async () => {
    jest.spyOn(context.attachments, 'delete').mockRejectedValueOnce(new Error('Fallo'));

    await expect(useCase.execute(ids.product)).rejects.toThrow('Fallo');
    expect(await context.products.findById(ids.product)).toBe(entities.product);

    await useCase.execute(ids.product);
    expect(await context.products.findAll()).toEqual([]);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Producto no encontrado.'));
  });
});
