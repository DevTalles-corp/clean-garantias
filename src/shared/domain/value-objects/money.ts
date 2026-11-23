// Value object Money: monto entero en centavos junto con su moneda.
// Evita errores de redondeo; sin él, los montos decimales perderían precisión.

import { ValidationError } from '@/shared/domain/errors/domain.errors';
import { requireOneOf } from '@/shared/domain/validators/guards';
import { currencyCodes, type CurrencyCode } from '@/shared/domain/value-objects/currency-code';

export interface Money {
  readonly amountCents: number; // entero
  readonly currency: CurrencyCode;
}

// Devuelve una copia inmutable: no comparte el objeto recibido.
export function createMoney({ amountCents, currency }: Money): Money {
  if (!Number.isSafeInteger(amountCents)) {
    throw new ValidationError('El monto debe ser un número entero de centavos.');
  }

  return Object.freeze({
    amountCents,
    currency: requireOneOf(currency, currencyCodes, 'La moneda no es válida.'),
  });
}
