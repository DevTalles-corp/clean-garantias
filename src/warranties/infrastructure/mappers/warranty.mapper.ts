// Mapper WarrantyMapper: convierte filas de SQLite en entidades Warranty y viceversa.
// Evita que la forma de la tabla llegue al dominio.
// endDate no tiene columna: la entidad siempre lo recalcula.

import { Warranty, type WarrantyType } from '@/warranties/domain/entities/warranty.entity';

// Fila de la tabla warranties. Es type y no interface para poder enviarse a upsertRow.
export type WarrantyRow = {
  id: string;
  product_id: string;
  type: string;
  provider: string;
  start_date: string;
  duration_months: number;
  policy_number: string | null;
  coverage: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  is_archived: number; // 0 o 1
  created_at: string;
  updated_at: string;
};

export class WarrantyMapper {
  static toDomain(row: WarrantyRow): Warranty {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Warranty.restore({
      id: row.id,
      productId: row.product_id,
      type: row.type as WarrantyType,
      provider: row.provider,
      startDate: row.start_date,
      durationMonths: row.duration_months,
      policyNumber: row.policy_number ?? undefined,
      coverage: row.coverage ?? undefined,
      contactPhone: row.contact_phone ?? undefined,
      contactEmail: row.contact_email ?? undefined,
      isArchived: row.is_archived === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  static toRow(warranty: Warranty): WarrantyRow {
    return {
      id: warranty.id,
      product_id: warranty.productId,
      type: warranty.type,
      provider: warranty.provider,
      start_date: warranty.startDate,
      duration_months: warranty.durationMonths,
      policy_number: warranty.policyNumber ?? null,
      coverage: warranty.coverage ?? null,
      contact_phone: warranty.contactPhone ?? null,
      contact_email: warranty.contactEmail ?? null,
      is_archived: warranty.isArchived ? 1 : 0,
      created_at: warranty.createdAt,
      updated_at: warranty.updatedAt,
    };
  }
}
