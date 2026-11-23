import {
  buildPurchases,
  filterPurchases,
  findUpcoming,
  summarizePurchases,
} from '@/products/presentation/models/purchase';
import { Product } from '@/products/domain/entities/product.entity';
import type { CurrencyCode } from '@/shared/domain/value-objects/currency-code';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';
import { entities, ids, testId, today } from '../../../shared/application/test-context';

function product(id: number, name: string, currency: CurrencyCode = 'CLP') {
  return Product.create({
    id: testId(id),
    name,
    categoryId: ids.category,
    storeId: ids.store,
    purchaseDate: '2024-01-01',
    purchasePrice: { amountCents: 1000, currency },
    createdAt: '2024-01-01',
  });
}

function warranty(id: number, productId: number, startDate: string, durationMonths: number) {
  return Warranty.create({
    id: testId(id),
    productId: testId(productId),
    purchaseDate: '2024-01-01',
    type: 'manufacturer',
    provider: 'Fábrica',
    startDate,
    durationMonths,
    createdAt: '2024-01-01',
  });
}

const purchases = buildPurchases({
  products: [product(10, 'Vigente'), product(11, 'Por vencer', 'USD'), product(12, 'Vencida')],
  warranties: [
    warranty(21, 10, '2025-01-01', 36),
    warranty(20, 10, '2024-01-01', 12),
    warranty(22, 11, '2025-06-20', 12),
    warranty(23, 12, '2024-01-01', 12),
  ],
  categories: [entities.category],
  stores: [entities.store],
  thresholdDays: 30,
  today,
});

const filters = { query: '', category: null, store: null, status: null };

describe('purchase', () => {
  test('encadena las garantías y usa la que vence al último', () => {
    expect(purchases[0]).toMatchObject({ endDate: '2028-01-01', status: 'active', categoryIcon: 'laptopcomputer' });
    expect(purchases[0].warranties.map(({ id }) => id)).toEqual([testId(20), testId(21)]);
  });

  test('calcula el estado con el umbral', () => {
    expect(purchases.map(({ status }) => status)).toEqual(['active', 'expiring', 'expired']);
  });

  test('un producto sin garantías queda vencido', () => {
    const [purchase] = buildPurchases({
      products: [product(13, 'Sin garantía')],
      warranties: [],
      categories: [],
      stores: [],
      thresholdDays: 30,
      today,
    });
    expect(purchase).toMatchObject({
      status: 'expired',
      storeName: 'Sin tienda',
      categoryName: 'Otros',
      categoryIcon: 'shippingbox',
    });
  });

  test('filtra por texto y estado, y deja las vencidas al final', () => {
    expect(filterPurchases(purchases, filters).map(({ product: { name } }) => name)).toEqual([
      'Por vencer',
      'Vigente',
      'Vencida',
    ]);
    expect(filterPurchases(purchases, { ...filters, query: ' VENCER ' })).toHaveLength(1);
    expect(filterPurchases(purchases, { ...filters, status: 'expired' })).toHaveLength(1);
  });

  test('los próximos vencimientos excluyen las vencidas', () => {
    expect(findUpcoming(purchases).map(({ product: { name } }) => name)).toEqual(['Por vencer', 'Vigente']);
  });

  test('el dinero protegido excluye vencidas y no mezcla monedas', () => {
    expect(summarizePurchases(purchases, today, 'USD')).toEqual({
      total: 3,
      active: 1,
      expiring: 1,
      expired: 1,
      expiringThisMonth: 1,
      protectedTotals: [
        { currency: 'USD', amountCents: 1000 },
        { currency: 'CLP', amountCents: 1000 },
      ],
    });
  });

  test('sin compras el total es cero en la moneda preferida', () => {
    expect(summarizePurchases([], today, 'EUR').protectedTotals).toEqual([{ currency: 'EUR', amountCents: 0 }]);
  });
});
