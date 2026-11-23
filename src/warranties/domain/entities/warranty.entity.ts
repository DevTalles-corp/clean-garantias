// Entidad del dominio Warranty: cobertura de un producto durante un periodo.
// Calcula vencimiento y estado; sin ella, podrían guardarse fechas que contradigan la duración.

// El constructor privado dirige la creación a create() o restore() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { ValidationError } from '@/shared/domain/errors/domain.errors';
import {
  optionalText,
  requireIsoDate,
  requireNonNegativeInteger,
  requireOneOf,
  requireText,
  requireUuid,
} from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import { isWarrantyDuration } from '@/shared/domain/validators/warranty-duration';
import { addMonths, daysBetween, type IsoDate } from '@/shared/domain/value-objects/iso-date';

export const warrantyTypes = ['manufacturer', 'store', 'extended'] as const;
export type WarrantyType = (typeof warrantyTypes)[number];

// Derivado: se calcula, nunca se guarda.
export type WarrantyStatus = 'active' | 'expiring' | 'expired';

export interface CreateWarrantyData {
  type: WarrantyType;
  provider: string;
  startDate: IsoDate;
  durationMonths: number;
  policyNumber?: string;
  coverage?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface CreateWarrantyProps extends CreateWarrantyData {
  id: string;
  productId: string;
  purchaseDate: IsoDate; // del producto: solo se usa para validar
  createdAt: IsoDate;
}

// Datos de una garantía que ya existe; endDate siempre se recalcula.
export interface RestoreWarrantyProps extends CreateWarrantyData {
  id: string;
  productId: string;
  isArchived: boolean;
  createdAt: IsoDate;
  updatedAt: IsoDate;
}

export class Warranty {
  readonly id: string; // UUID
  readonly productId: string;
  readonly type: WarrantyType;
  readonly provider: string;
  readonly startDate: IsoDate;
  readonly durationMonths: number;
  readonly endDate: IsoDate; // startDate + durationMonths
  readonly policyNumber?: string;
  readonly coverage?: string;
  readonly contactPhone?: string;
  readonly contactEmail?: string;
  readonly isArchived: boolean;
  readonly createdAt: IsoDate;
  readonly updatedAt: IsoDate;

  private constructor(warranty: RestoreWarrantyProps) {
    this.id = warranty.id;
    this.productId = warranty.productId;
    this.type = warranty.type;
    this.provider = warranty.provider;
    this.startDate = warranty.startDate;
    this.durationMonths = warranty.durationMonths;
    this.endDate = addMonths(warranty.startDate, warranty.durationMonths);
    this.policyNumber = warranty.policyNumber;
    this.coverage = warranty.coverage;
    this.contactPhone = warranty.contactPhone;
    this.contactEmail = warranty.contactEmail;
    this.isArchived = warranty.isArchived;
    this.createdAt = warranty.createdAt;
    this.updatedAt = warranty.updatedAt;

    Object.freeze(this);
  }

  static create(input: CreateWarrantyProps): Warranty {
    const warranty = Warranty.restore({ ...input, isArchived: false, updatedAt: input.createdAt });
    warranty.assertStartsAfterPurchase(input.purchaseDate);
    return warranty;
  }

  static restore(input: RestoreWarrantyProps): Warranty {
    const { durationMonths } = input;

    if (!isWarrantyDuration(durationMonths)) {
      throw new ValidationError('La duración debe ser un entero entre 1 y 240 meses.');
    }

    return new Warranty({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      productId: requireUuid(input.productId, 'El producto debe ser un UUID válido.'),
      type: requireOneOf(input.type, warrantyTypes, 'El tipo de garantía no es válido.'),
      provider: requireText(input.provider, 'El proveedor es obligatorio.'),
      startDate: requireIsoDate(input.startDate, 'La fecha de inicio no es válida.'),
      durationMonths,
      policyNumber: optionalText(input.policyNumber),
      coverage: optionalText(input.coverage),
      contactPhone: optionalText(input.contactPhone),
      contactEmail: optionalText(input.contactEmail)?.toLowerCase(),
      isArchived: input.isArchived,
      createdAt: requireIsoDate(input.createdAt, 'La fecha de creación no es válida.'),
      updatedAt: requireIsoDate(input.updatedAt, 'La fecha de actualización no es válida.'),
    });
  }

  // Un campo opcional enviado como undefined se borra.
  update(
    changes: Partial<CreateWarrantyData>,
    purchaseDate: IsoDate,
    updatedAt: IsoDate,
  ): Warranty {
    const warranty = Warranty.restore({
      ...this,
      ...changes,
      id: this.id,
      productId: this.productId,
      isArchived: this.isArchived,
      createdAt: this.createdAt,
      updatedAt,
    });
    warranty.assertStartsAfterPurchase(purchaseDate);
    return warranty;
  }

  setArchived(isArchived: boolean, updatedAt: IsoDate): Warranty {
    return Warranty.restore({ ...this, isArchived, updatedAt });
  }

  static normalizeId(id: string): string {
    return normalizeUuid(id);
  }

  // También sirve para revisar la garantía cuando cambia la fecha de compra del producto.
  assertStartsAfterPurchase(purchaseDate: IsoDate): void {
    requireIsoDate(purchaseDate, 'La fecha de compra no es válida.');
    if (this.startDate < purchaseDate) {
      throw new ValidationError('La garantía no puede iniciar antes de la fecha de compra.');
    }
  }
}

// El día de endDate todavía está cubierto.
export function getWarrantyStatus(
  warranty: Warranty,
  today: IsoDate,
  thresholdDays: number,
): WarrantyStatus {
  requireIsoDate(today, 'La fecha actual no es válida.');
  requireNonNegativeInteger(thresholdDays, 'El umbral debe ser un entero mayor o igual a cero.');

  if (today > warranty.endDate) return 'expired';
  return daysBetween(today, warranty.endDate) <= thresholdDays ? 'expiring' : 'active';
}
