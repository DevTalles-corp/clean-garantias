// Contrato del dominio Clock: indica la fecha actual sin leer el reloj del dispositivo.
// Invierte la dependencia; sin él, los casos de uso darían resultados distintos cada día.

import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export interface Clock {
  today(): IsoDate; // fecha local del usuario
}
