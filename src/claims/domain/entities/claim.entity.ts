// Entidad del dominio Claim: reclamo hecho sobre una garantía.
// Protege su apertura y cierre; sin ella, se podría reclamar una garantía vencida.

// El constructor privado dirige la creación a create() o restore() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { ConflictError, ValidationError } from '@/shared/domain/errors/domain.errors';
import {
  optionalText,
  requireIsoDate,
  requireOneOf,
  requireText,
  requireUuid,
} from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export const claimStatuses = ['open', 'in_progress', 'resolved', 'rejected'] as const;
export type ClaimStatus = (typeof claimStatuses)[number];

export interface CreateClaimData {
  warrantyId: string;
  issue: string;
  ticketNumber?: string;
}

export interface CreateClaimProps extends CreateClaimData {
  id: string;
  warrantyEndDate: IsoDate; // de la garantía: solo se usa para validar
  openedAt: IsoDate;
}

// Datos completos de un reclamo que ya existe.
export interface RestoreClaimProps extends CreateClaimData {
  id: string;
  status: ClaimStatus;
  openedAt: IsoDate;
  resolvedAt?: IsoDate;
  resolution?: string;
  updatedAt: IsoDate;
}

export type UpdateClaimData = Partial<
  Pick<RestoreClaimProps, 'issue' | 'ticketNumber' | 'status' | 'resolvedAt' | 'resolution'>
>;

export class Claim {
  readonly id: string; // UUID
  readonly warrantyId: string;
  readonly issue: string;
  readonly status: ClaimStatus;
  readonly ticketNumber?: string;
  readonly openedAt: IsoDate;
  readonly resolvedAt?: IsoDate;
  readonly resolution?: string;
  readonly updatedAt: IsoDate;

  private constructor(claim: RestoreClaimProps) {
    this.id = claim.id;
    this.warrantyId = claim.warrantyId;
    this.issue = claim.issue;
    this.status = claim.status;
    this.ticketNumber = claim.ticketNumber;
    this.openedAt = claim.openedAt;
    this.resolvedAt = claim.resolvedAt;
    this.resolution = claim.resolution;
    this.updatedAt = claim.updatedAt;

    Object.freeze(this);
  }

  static create(input: CreateClaimProps): Claim {
    const claim = Claim.restore({
      id: input.id,
      warrantyId: input.warrantyId,
      issue: input.issue,
      ticketNumber: input.ticketNumber,
      status: 'open',
      openedAt: input.openedAt,
      updatedAt: input.openedAt,
    });

    requireIsoDate(input.warrantyEndDate, 'La fecha de vencimiento no es válida.');
    if (claim.openedAt > input.warrantyEndDate) {
      throw new ConflictError('No se puede abrir un reclamo sobre una garantía vencida.');
    }

    return claim;
  }

  static restore(input: RestoreClaimProps): Claim {
    const status = requireOneOf(input.status, claimStatuses, 'El estado del reclamo no es válido.');
    const resolvedAt = optionalText(input.resolvedAt);

    if ((status === 'resolved' || status === 'rejected') && !resolvedAt) {
      throw new ValidationError('Un reclamo resuelto o rechazado requiere fecha de resolución.');
    }

    return new Claim({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      warrantyId: requireUuid(input.warrantyId, 'La garantía debe ser un UUID válido.'),
      issue: requireText(input.issue, 'La descripción del problema es obligatoria.'),
      status,
      ticketNumber: optionalText(input.ticketNumber),
      openedAt: requireIsoDate(input.openedAt, 'La fecha de apertura no es válida.'),
      resolvedAt: resolvedAt && requireIsoDate(resolvedAt, 'La fecha de resolución no es válida.'),
      resolution: optionalText(input.resolution),
      updatedAt: requireIsoDate(input.updatedAt, 'La fecha de actualización no es válida.'),
    });
  }

  // Un campo opcional enviado como undefined se borra.
  update(changes: UpdateClaimData, updatedAt: IsoDate): Claim {
    return Claim.restore({
      ...this,
      ...changes,
      id: this.id,
      warrantyId: this.warrantyId,
      openedAt: this.openedAt,
      updatedAt,
    });
  }

  static normalizeId(id: string): string {
    return normalizeUuid(id);
  }
}
