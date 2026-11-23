// Implementación SqliteProductRepository: guarda y consulta los productos en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Product } from '@/products/domain/entities/product.entity';
import type { ProductRepository } from '@/products/domain/repositories/product.repository';
import {
  ProductMapper,
  type ProductRow,
} from '@/products/infrastructure/mappers/product.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteProductRepository implements ProductRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Product | undefined> {
    const row = await this.database.getFirstAsync<ProductRow>(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return row ? ProductMapper.toDomain(row) : undefined;
  }

  async findAll(): Promise<Product[]> {
    const rows = await this.database.getAllAsync<ProductRow>(
      'SELECT * FROM products ORDER BY purchase_date DESC, id'
    );
    return rows.map(ProductMapper.toDomain);
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const rows = await this.database.getAllAsync<ProductRow>(
      'SELECT * FROM products WHERE category_id = ? ORDER BY purchase_date DESC, id',
      [categoryId]
    );
    return rows.map(ProductMapper.toDomain);
  }

  async findByStoreId(storeId: string): Promise<Product[]> {
    const rows = await this.database.getAllAsync<ProductRow>(
      'SELECT * FROM products WHERE store_id = ? ORDER BY purchase_date DESC, id',
      [storeId]
    );
    return rows.map(ProductMapper.toDomain);
  }

  async save(product: Product): Promise<void> {
    await upsertRow(this.database, 'products', ProductMapper.toRow(product));
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM products WHERE id = ?', [id]);
  }
}
