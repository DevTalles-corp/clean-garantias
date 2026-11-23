// Compras de ejemplo del diseño de referencia.

import type { RegisterPurchaseInput } from '@/products/presentation/services/register-purchase';

export interface SamplePurchase extends Omit<RegisterPurchaseInput, 'categoryId' | 'price'> {
  categoryName: string;
  amount: number; // pesos chilenos
}

export const samplePurchases: readonly SamplePurchase[] = [
  {
    name: 'Refrigerador Samsung No Frost',
    storeName: 'Falabella',
    purchaseDate: '2024-11-28',
    amount: 649990,
    categoryName: 'Electrodomésticos',
    months: 12,
    extensions: [{ type: 'extended', provider: 'Falabella Extendida', months: 12 }],
    receiptFileName: 'recibo-p1.jpg',
  },
  {
    name: 'MacBook Air M3',
    storeName: 'Apple Store',
    purchaseDate: '2025-12-10',
    amount: 1299990,
    categoryName: 'Tecnología',
    months: 12,
    receiptFileName: 'recibo-p2.jpg',
  },
  {
    name: 'iPhone 16',
    storeName: 'Entel',
    purchaseDate: '2026-01-15',
    amount: 999990,
    categoryName: 'Tecnología',
    months: 12,
    receiptFileName: 'recibo-p3.jpg',
  },
  {
    name: 'Lavadora LG 9 kg',
    storeName: 'Ripley',
    purchaseDate: '2025-03-15',
    amount: 459990,
    categoryName: 'Electrodomésticos',
    months: 24,
  },
  {
    name: 'Taladro Bosch GSB 13',
    storeName: 'Sodimac',
    purchaseDate: '2026-09-01',
    amount: 89990,
    categoryName: 'Herramientas',
    months: 24,
    receiptFileName: 'recibo-p5.jpg',
  },
  {
    name: 'Bicicleta Trek Marlin 5',
    storeName: 'Trek Store',
    purchaseDate: '2026-04-10',
    amount: 549990,
    categoryName: 'Deportes',
    months: 12,
    extensions: [{ type: 'store', provider: 'Trek Store', months: 12 }],
    receiptFileName: 'recibo-p6.jpg',
  },
  {
    name: 'Audífonos Sony WH-1000XM5',
    storeName: 'Paris',
    purchaseDate: '2025-06-03',
    amount: 329990,
    categoryName: 'Tecnología',
    months: 12,
    receiptFileName: 'recibo-p7.jpg',
  },
  {
    name: 'Sofá modular 3 cuerpos',
    storeName: 'Homy',
    purchaseDate: '2026-02-20',
    amount: 789990,
    categoryName: 'Hogar',
    months: 6,
  },
];
