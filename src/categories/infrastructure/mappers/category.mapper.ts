// Mapper CategoryMapper: convierte filas de SQLite en entidades Category y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import { Category } from '@/categories/domain/entities/category.entity';

// Fila de la tabla categories. Es type y no interface para poder enviarse a upsertRow.
export type CategoryRow = {
  id: string;
  name: string;
  icon: string;
  color: string;
  default_warranty_months: number;
  is_system: number; // 0 o 1
  created_at: string;
};

export class CategoryMapper {
  static toDomain(row: CategoryRow): Category {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Category.create({
      id: row.id,
      name: row.name,
      icon: row.icon,
      color: row.color,
      defaultWarrantyMonths: row.default_warranty_months,
      isSystem: row.is_system === 1,
      createdAt: row.created_at,
    });
  }

  static toRow(category: Category): CategoryRow {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      default_warranty_months: category.defaultWarrantyMonths,
      is_system: category.isSystem ? 1 : 0,
      created_at: category.createdAt,
    };
  }
}
