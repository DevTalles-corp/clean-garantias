// Implementación SystemClock: lee la fecha local del dispositivo.
// Cumple el contrato Clock; usa la zona del usuario, no UTC.

import type { Clock } from '@/shared/domain/services/clock';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export class SystemClock implements Clock {
  today(): IsoDate {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }
}
