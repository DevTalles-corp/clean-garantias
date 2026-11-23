// Modelo de vista: une un producto con su tienda, categoría y cobertura.
// Usa las reglas del dominio; no las redefine.

import type { Category } from '@/categories/domain/entities/category.entity';
import type { Product } from '@/products/domain/entities/product.entity';
import type { CurrencyCode } from '@/shared/domain/value-objects/currency-code';
import { daysBetween, type IsoDate } from '@/shared/domain/value-objects/iso-date';
import type { Money } from '@/shared/domain/value-objects/money';
import type { Store } from '@/stores/domain/entities/store.entity';
import { getWarrantyStatus, type Warranty, type WarrantyStatus } from '@/warranties/domain/entities/warranty.entity';

export interface Purchase {
  id: string;
  product: Product;
  storeName: string;
  categoryName: string;
  categoryCode: string;
  warranties: readonly Warranty[]; // en orden cronológico
  finalWarranty?: Warranty; // la que vence al último
  endDate: IsoDate;
  daysLeft: number;
  status: WarrantyStatus;
}

export interface PurchaseSources {
  products: readonly Product[];
  warranties: readonly Warranty[];
  categories: readonly Category[];
  stores: readonly Store[];
  thresholdDays: number;
  today: IsoDate;
}

export function buildPurchases(sources: PurchaseSources): Purchase[] {
  const { products, warranties, categories, stores, thresholdDays, today } = sources;
  const categoryNames = new Map(categories.map(({ id, name }) => [id, name]));
  const storeNames = new Map(stores.map(({ id, name }) => [id, name]));

  return products.map((product) => {
    const coverage = warranties
      .filter(({ productId, isArchived }) => productId === product.id && !isArchived)
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.endDate.localeCompare(b.endDate));
    const finalWarranty = coverage.reduce<Warranty | undefined>(
      (last, warranty) => (last && last.endDate >= warranty.endDate ? last : warranty),
      undefined,
    );
    const endDate = finalWarranty?.endDate ?? product.purchaseDate;
    const categoryName = categoryNames.get(product.categoryId) ?? 'Otros';

    return {
      id: product.id,
      product,
      storeName: (product.storeId && storeNames.get(product.storeId)) || 'Sin tienda',
      categoryName,
      categoryCode: categoryName.slice(0, 3).toUpperCase(),
      warranties: coverage,
      finalWarranty,
      endDate,
      daysLeft: daysBetween(today, endDate),
      status: finalWarranty ? getWarrantyStatus(finalWarranty, today, thresholdDays) : 'expired',
    };
  });
}

export interface PurchaseFilters {
  query: string;
  category: string | null; // null: todas
  store: string | null;
  status: WarrantyStatus | null;
}

export function filterPurchases(purchases: readonly Purchase[], filters: PurchaseFilters): Purchase[] {
  const query = filters.query.trim().toLowerCase();
  return purchases
    .filter(
      ({ product, storeName, categoryName, status }) =>
        `${product.name} ${storeName}`.toLowerCase().includes(query) &&
        (!filters.category || categoryName === filters.category) &&
        (!filters.store || storeName === filters.store) &&
        (!filters.status || status === filters.status),
    )
    .sort((a, b) => Number(a.daysLeft < 0) - Number(b.daysLeft < 0) || a.daysLeft - b.daysLeft);
}

export function findUpcoming(purchases: readonly Purchase[]): Purchase[] {
  return purchases
    .filter(({ daysLeft, finalWarranty }) => finalWarranty && daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);
}

export interface PurchaseSummary {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  expiringThisMonth: number;
  protectedTotals: Money[]; // uno por moneda; la preferida va primero
}

export function summarizePurchases(
  purchases: readonly Purchase[],
  today: IsoDate,
  currency: CurrencyCode,
): PurchaseSummary {
  const count = (status: WarrantyStatus) => purchases.filter((item) => item.status === status).length;
  const totals = new Map<CurrencyCode, number>();

  // Los montos de distinta moneda no se suman entre sí.
  for (const { status, product } of purchases) {
    const price = product.purchasePrice;
    if (status === 'expired' || !price) continue;
    totals.set(price.currency, (totals.get(price.currency) ?? 0) + price.amountCents);
  }
  if (totals.size === 0) totals.set(currency, 0);

  return {
    total: purchases.length,
    active: count('active'),
    expiring: count('expiring'),
    expired: count('expired'),
    expiringThisMonth: purchases.filter(
      ({ endDate, status }) => status !== 'expired' && endDate.slice(0, 7) === today.slice(0, 7),
    ).length,
    protectedTotals: [...totals]
      .map(([code, amountCents]) => ({ currency: code, amountCents }))
      .sort((a, b) => Number(b.currency === currency) - Number(a.currency === currency)),
  };
}
