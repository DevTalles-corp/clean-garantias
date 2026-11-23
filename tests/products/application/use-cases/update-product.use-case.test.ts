import { UpdateProductUseCase } from '@/products/application/use-cases/update-product.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  today,
  validationError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('UpdateProductUseCase', () => {
  let context: TestContext;
  let useCase: UpdateProductUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new UpdateProductUseCase({
      productRepository: context.products,
      categoryRepository: context.categories,
      storeRepository: context.stores,
      warrantyRepository: context.warranties,
      clock: context.clock,
    });
  });

  test('actualiza, guarda y conserva los demás datos', async () => {
    const product = await useCase.execute(`  ${ids.product.toUpperCase()}  `, { name: 'Monitor', brand: undefined });

    expect({ ...product }).toEqual({ ...entities.product, name: 'Monitor', brand: undefined, updatedAt: today });
    expect(await context.products.findById(ids.product)).toBe(product);
  });

  test('lanza ValidationError y no guarda con datos inválidos', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(useCase.execute(ids.product, { name: ' ' })).rejects.toThrow(
      validationError('El nombre es obligatorio.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, {})).rejects.toThrow(notFoundError('Producto no encontrado.'));
  });

  test('lanza NotFoundError y no guarda si la categoría no existe', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(useCase.execute(ids.product, { categoryId: missingId })).rejects.toThrow(notFoundError('Categoría no encontrada.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError y no guarda si la tienda no existe', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(useCase.execute(ids.product, { storeId: missingId })).rejects.toThrow(notFoundError('Tienda no encontrada.'));
    expect(save).not.toHaveBeenCalled();
  });

  test('rechaza una fecha de compra posterior al inicio de una garantía', async () => {
    const save = jest.spyOn(context.products, 'save');

    await expect(useCase.execute(ids.product, { purchaseDate: '2026-01-11' })).rejects.toThrow(
      validationError('La garantía no puede iniciar antes de la fecha de compra.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('acepta una fecha de compra compatible con sus garantías', async () => {
    const product = await useCase.execute(ids.product, { purchaseDate: '2026-01-09' });

    expect(product.purchaseDate).toBe('2026-01-09');
  });
});
