// Registra una compra del formulario encadenando los casos de uso de cada módulo.
// Si un paso falla, borra el producto para no dejar una compra a medias.

import type { AppUseCases } from '@/app.composition';
import type { Product } from '@/products/domain/entities/product.entity';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import type { Money } from '@/shared/domain/value-objects/money';
import type { CreateWarrantyData, Warranty } from '@/warranties/domain/entities/warranty.entity';

export interface PurchaseExtension extends Pick<CreateWarrantyData, 'type' | 'provider'> {
  months: number;
}

export interface RegisterPurchaseInput {
  name: string;
  storeName: string;
  categoryId: string;
  purchaseDate: IsoDate;
  price: Money;
  months: number;
  extensions?: readonly PurchaseExtension[];
  receiptFileName?: string;
}

export async function registerPurchase(
  useCases: AppUseCases,
  input: RegisterPurchaseInput,
): Promise<{ product: Product; warranty: Warranty }> {
  const product = await useCases.products.create.execute({
    name: input.name,
    storeId: await findOrCreateStore(useCases, input.storeName),
    categoryId: input.categoryId,
    purchaseDate: input.purchaseDate,
    purchasePrice: input.price,
  });

  try {
    let warranty = await useCases.warranties.create.execute(product.id, {
      type: 'manufacturer',
      provider: 'Fábrica',
      startDate: product.purchaseDate,
      durationMonths: input.months,
    });
    for (const { type, provider, months } of input.extensions ?? []) {
      warranty = await useCases.warranties.create.execute(product.id, {
        type,
        provider,
        startDate: warranty.endDate,
        durationMonths: months,
      });
    }
    if (input.receiptFileName) {
      await attachSimulatedReceipt(useCases, product.id, input.receiptFileName);
    }
    return { product, warranty };
  } catch (error) {
    await useCases.products.delete.execute(product.id);
    throw error;
  }
}

// Recibo simulado, como en el prototipo: aún no hay cámara ni archivo real.
export async function attachSimulatedReceipt(
  useCases: AppUseCases,
  productId: string,
  fileName = `recibo-${productId.slice(0, 8)}.jpg`,
): Promise<void> {
  await useCases.attachments.create.execute({
    ownerType: 'product',
    ownerId: productId,
    kind: 'receipt',
    fileUri: `simulated://${fileName}`,
    fileName,
    mimeType: 'image/jpeg',
    sizeBytes: 0,
  });
}

async function findOrCreateStore(useCases: AppUseCases, storeName: string): Promise<string> {
  const name = storeName.trim().toLowerCase();
  const stores = await useCases.stores.findAll.execute();
  const store =
    stores.find((item) => item.name.toLowerCase() === name) ??
    (await useCases.stores.create.execute({ name: storeName }));
  return store.id;
}
