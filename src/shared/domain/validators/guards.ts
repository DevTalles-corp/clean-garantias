// Guardas de dominio: normalizan un valor y lanzan ValidationError si no es válido.
// Evitan repetir las mismas comprobaciones; sin ellas, cada entidad las implementaría por su cuenta.

import { ValidationError } from '@/shared/domain/errors/domain.errors';
import { isUuid, normalizeUuid } from '@/shared/domain/validators/uuid';
import { isIsoDate, type IsoDate } from '@/shared/domain/value-objects/iso-date';

export function requireText(value: string, message: string): string {
  const text = value.trim();
  if (!text) throw new ValidationError(message);
  return text;
}

// Un texto opcional vacío equivale a no tener valor.
export function optionalText(value: string | undefined): string | undefined {
  return value?.trim() || undefined;
}

export function requireUuid(value: string, message: string): string {
  const id = normalizeUuid(value);
  if (!isUuid(id)) throw new ValidationError(message);
  return id;
}

export function requireIsoDate(value: IsoDate, message: string): IsoDate {
  if (!isIsoDate(value)) throw new ValidationError(message);
  return value;
}

export function requireNonNegativeInteger(value: number, message: string): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new ValidationError(message);
  return value;
}

export function requireOneOf<T extends string>(value: T, allowed: readonly T[], message: string): T {
  if (!allowed.includes(value)) throw new ValidationError(message);
  return value;
}
