// Reemplaza todas las compras por las de ejemplo.

import type { AppUseCases } from '@/app.composition';
import { samplePurchases } from '@/products/presentation/constants/sample-purchases';
import { registerPurchase } from '@/products/presentation/services/register-purchase';

export async function restoreSamplePurchases(useCases: AppUseCases): Promise<void> {
  for (const product of await useCases.products.findAll.execute()) {
    await useCases.products.delete.execute(product.id);
  }

  const categories = await useCases.categories.findAll.execute();
  for (const { categoryName, amount, ...sample } of samplePurchases) {
    const category = categories.find(({ name }) => name === categoryName);
    if (!category) continue;
    await registerPurchase(useCases, {
      ...sample,
      categoryId: category.id,
      price: { amountCents: amount * 100, currency: 'CLP' },
    });
  }
}
