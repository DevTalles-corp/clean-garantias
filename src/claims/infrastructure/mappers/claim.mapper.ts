// Mapper ClaimMapper: convierte filas de SQLite en entidades Claim y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import { Claim, type ClaimStatus } from '@/claims/domain/entities/claim.entity';

// Fila de la tabla claims. Es type y no interface para poder enviarse a upsertRow.
export type ClaimRow = {
  id: string;
  warranty_id: string;
  issue: string;
  status: string;
  ticket_number: string | null;
  opened_at: string;
  resolved_at: string | null;
  resolution: string | null;
  updated_at: string;
};

export class ClaimMapper {
  static toDomain(row: ClaimRow): Claim {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Claim.restore({
      id: row.id,
      warrantyId: row.warranty_id,
      issue: row.issue,
      status: row.status as ClaimStatus,
      ticketNumber: row.ticket_number ?? undefined,
      openedAt: row.opened_at,
      resolvedAt: row.resolved_at ?? undefined,
      resolution: row.resolution ?? undefined,
      updatedAt: row.updated_at,
    });
  }

  static toRow(claim: Claim): ClaimRow {
    return {
      id: claim.id,
      warranty_id: claim.warrantyId,
      issue: claim.issue,
      status: claim.status,
      ticket_number: claim.ticketNumber ?? null,
      opened_at: claim.openedAt,
      resolved_at: claim.resolvedAt ?? null,
      resolution: claim.resolution ?? null,
      updated_at: claim.updatedAt,
    };
  }
}
