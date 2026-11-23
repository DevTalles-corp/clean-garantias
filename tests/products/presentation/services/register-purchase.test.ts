import type { AppUseCases } from '@/app.composition';
import { registerPurchase } from '@/products/presentation/services/register-purchase';

import { pickedPhoto } from '../../../shared/application/test-context';

const input = {
  name: 'TV',
  storeName: ' paris ',
  categoryId: 'category',
  purchaseDate: '2026-01-01',
  price: { amountCents: 100, currency: 'CLP' as const },
  months: 12,
};

function createUseCases() {
  const useCases = {
    products: {
      create: { execute: jest.fn().mockResolvedValue({ id: 'product', purchaseDate: '2026-01-01' }) },
      delete: { execute: jest.fn().mockResolvedValue(undefined) },
    },
    stores: {
      findAll: { execute: jest.fn().mockResolvedValue([{ id: 'store', name: 'Paris' }]) },
      create: { execute: jest.fn().mockResolvedValue({ id: 'new-store' }) },
    },
    warranties: { create: { execute: jest.fn().mockResolvedValue({ endDate: '2027-01-01' }) } },
    attachments: { attachPhoto: { execute: jest.fn() }, create: { execute: jest.fn() } },
  };
  return { mocks: useCases, useCases: useCases as unknown as AppUseCases };
}

describe('registerPurchase', () => {
  test('reutiliza la tienda sin distinguir mayúsculas', async () => {
    const { mocks, useCases } = createUseCases();
    await registerPurchase(useCases, input);
    expect(mocks.stores.create.execute).not.toHaveBeenCalled();
    expect(mocks.products.create.execute).toHaveBeenCalledWith(expect.objectContaining({ storeId: 'store' }));
  });

  test('la extensión empieza donde termina la garantía anterior', async () => {
    const { mocks, useCases } = createUseCases();
    await registerPurchase(useCases, {
      ...input,
      extensions: [{ type: 'extended', provider: 'Seguro', months: 6 }],
    });
    expect(mocks.warranties.create.execute).toHaveBeenLastCalledWith('product', {
      type: 'extended',
      provider: 'Seguro',
      startDate: '2027-01-01',
      durationMonths: 6,
    });
  });

  test('si falla la garantía borra el producto', async () => {
    const { mocks, useCases } = createUseCases();
    mocks.warranties.create.execute.mockRejectedValue(new Error('falló'));
    await expect(registerPurchase(useCases, input)).rejects.toThrow('falló');
    expect(mocks.products.delete.execute).toHaveBeenCalledWith('product');
  });

  test('adjunta la foto elegida en vez del recibo simulado', async () => {
    const { mocks, useCases } = createUseCases();
    await registerPurchase(useCases, { ...input, photo: pickedPhoto, receiptFileName: 'recibo.jpg' });
    expect(mocks.attachments.attachPhoto.execute).toHaveBeenCalledWith({
      ownerType: 'product',
      ownerId: 'product',
      kind: 'receipt',
      photo: pickedPhoto,
    });
    expect(mocks.attachments.create.execute).not.toHaveBeenCalled();
  });

  test('sin foto conserva el recibo simulado', async () => {
    const { mocks, useCases } = createUseCases();
    await registerPurchase(useCases, { ...input, receiptFileName: 'recibo.jpg' });
    expect(mocks.attachments.attachPhoto.execute).not.toHaveBeenCalled();
    expect(mocks.attachments.create.execute).toHaveBeenCalledWith(
      expect.objectContaining({ fileUri: 'simulated://recibo.jpg', sizeBytes: 0 }),
    );
  });

  test('si falla la foto borra el producto', async () => {
    const { mocks, useCases } = createUseCases();
    mocks.attachments.attachPhoto.execute.mockRejectedValue(new Error('falló'));
    await expect(registerPurchase(useCases, { ...input, photo: pickedPhoto })).rejects.toThrow('falló');
    expect(mocks.products.delete.execute).toHaveBeenCalledWith('product');
  });
});
