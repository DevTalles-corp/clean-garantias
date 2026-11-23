// Mapper ProductMapper: convierte filas de SQLite en entidades Product y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import { Product } from '@/products/domain/entities/product.entity';
import type { CurrencyCode } from '@/shared/domain/value-objects/currency-code';
import type { Money } from '@/shared/domain/value-objects/money';

// Fila de la tabla products. Es type y no interface para poder enviarse a upsertRow.
export type ProductRow = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  serial_number: string | null;
  category_id: string;
  store_id: string | null;
  purchase_date: string;
  price_amount_cents: number | null;
  price_currency: string | null;
  image_uri: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export class ProductMapper {
  static toDomain(row: ProductRow): Product {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Product.restore({
      id: row.id,
      name: row.name,
      brand: row.brand ?? undefined,
      model: row.model ?? undefined,
      serialNumber: row.serial_number ?? undefined,
      categoryId: row.category_id,
      storeId: row.store_id ?? undefined,
      purchaseDate: row.purchase_date,
      purchasePrice: toMoney(row),
      imageUri: row.image_uri ?? undefined,
      notes: row.notes ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static toRow(product: Product): ProductRow {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand ?? null,
      model: product.model ?? null,
      serial_number: product.serialNumber ?? null,
      category_id: product.categoryId,
      store_id: product.storeId ?? null,
      purchase_date: product.purchaseDate,
      price_amount_cents: product.purchasePrice?.amountCents ?? null,
      price_currency: product.purchasePrice?.currency ?? null,
      image_uri: product.imageUri ?? null,
      notes: product.notes ?? null,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    };
  }
}

// El precio ocupa dos columnas: ambas tienen valor o ninguna.
function toMoney(row: ProductRow): Money | undefined {
  if (row.price_amount_cents === null || row.price_currency === null)
    return undefined;
  return {
    amountCents: row.price_amount_cents,
    currency: row.price_currency as CurrencyCode,
  };
}
