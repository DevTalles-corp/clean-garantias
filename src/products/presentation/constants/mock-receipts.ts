// Recibos simulados del prototipo; se reemplazarán al integrar cámara y lectura real.

import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import type { Money } from '@/shared/domain/value-objects/money';

export interface MockReceipt {
  store: string;
  item: string;
  date: IsoDate;
  total: Money;
}

const clp = (amount: number): Money => ({ amountCents: amount * 100, currency: 'CLP' });

export const mockReceipts: readonly MockReceipt[] = [
  { store: 'FALABELLA', item: 'Hervidor Oster', date: '2026-11-18', total: clp(34990) },
  { store: 'PARIS', item: 'Smart TV 55"', date: '2026-11-12', total: clp(429990) },
  { store: 'SODIMAC', item: 'Aspiradora', date: '2026-10-30', total: clp(119990) },
];
