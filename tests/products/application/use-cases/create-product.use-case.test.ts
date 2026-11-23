import { CreateProductUseCase } from '@/products/application/use-cases/create-product.use-case';
import {
  Product,
  type CreateProductData,
} from '@/products/domain/entities/product.entity';

import {
  createSeededContext,
  firstGeneratedId,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

const input: CreateProductData = {
  name: '  Monitor  ',
  categoryId: ids.category,
  storeId: ids.store,
  purchaseDate: '2026-05-01',
};

describe('CreateProductUseCase', () => {
  let context: TestContext;
  let useCase: CreateProductUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new CreateProductUseCase({
      productRepository: context.products,
      categoryRepository: context.categories,
      storeRepository: context.stores,
      idGenerator: context.idGenerator,
      clock: context.clock,
    });
  });

  test('crea, guarda y devuelve la entidad con id y fecha inyectados', async () => {
    const product = await useCase.execute(input);

    expect(product).toBeInstanceOf(Product);
    expect(product).toMatchObject({
      id: firstGeneratedId,
      name: 'Monitor',
      createdAt: today,
      updatedAt: today,
    });
    expect(await context.products.findById(firstGeneratedId)).toBe(product);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(useCase.execute({ ...input, name: '' })).rejects.toThrow(
      validationError('El nombre es obligatorio.')
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError y no guarda si la categoría no existe', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(
      useCase.execute({ ...input, categoryId: missingId })
    ).rejects.toThrow(notFoundError('Categoría no encontrada.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError y no guarda si la tienda no existe', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(
      useCase.execute({ ...input, storeId: missingId })
    ).rejects.toThrow(notFoundError('Tienda no encontrada.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('permite un producto sin tienda', async () => {
    expect(
      (await useCase.execute({ ...input, storeId: undefined })).storeId
    ).toBeUndefined();
  });
});
