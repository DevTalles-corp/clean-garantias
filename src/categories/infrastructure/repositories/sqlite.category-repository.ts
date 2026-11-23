// Implementación SqliteCategoryRepository: guarda y consulta las categorías en SQLite.
// Cumple el contrato del dominio; recibe la base de datos ya abierta y migrada.

import type { SQLiteDatabase } from 'expo-sqlite';

import type { Category } from '@/categories/domain/entities/category.entity';
import type { CategoryRepository } from '@/categories/domain/repositories/category.repository';
import {
  CategoryMapper,
  type CategoryRow,
} from '@/categories/infrastructure/mappers/category.mapper';
import { upsertRow } from '@/shared/infrastructure/database/sqlite.upsert';

export class SqliteCategoryRepository implements CategoryRepository {
  private readonly database: SQLiteDatabase;

  constructor(database: SQLiteDatabase) {
    this.database = database;
  }

  async findById(id: string): Promise<Category | undefined> {
    const row = await this.database.getFirstAsync<CategoryRow>(
      'SELECT * FROM categories WHERE id = ?',
      [id],
    );
    return row ? CategoryMapper.toDomain(row) : undefined;
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.database.getAllAsync<CategoryRow>(
      'SELECT * FROM categories ORDER BY name COLLATE NOCASE, id',
    );
    return rows.map(CategoryMapper.toDomain);
  }

  async save(category: Category): Promise<void> {
    await upsertRow(this.database, 'categories', CategoryMapper.toRow(category));
  }

  async delete(id: string): Promise<void> {
    await this.database.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  }
}
