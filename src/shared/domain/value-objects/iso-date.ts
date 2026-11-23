// Value object IsoDate: fecha de calendario 'YYYY-MM-DD', sin hora ni zona horaria.
// Centraliza la aritmética de fechas; sin él, la zona del dispositivo podría desplazar los vencimientos.

import { ValidationError } from '@/shared/domain/errors/domain.errors';

export type IsoDate = string; // 'YYYY-MM-DD': se puede comparar con < y >

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const millisecondsPerDay = 86_400_000;

export function isIsoDate(value: string): boolean {
  if (typeof value !== 'string' || !isoDatePattern.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  // Descarta fechas inexistentes como 2026-02-30.
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

// Si el mes destino no tiene ese día, usa el último: 2026-01-31 + 1 mes = 2026-02-28.
export function addMonths(date: IsoDate, months: number): IsoDate {
  const [year, month, day] = parse(date);
  const lastDay = new Date(Date.UTC(year, month + months, 0)).getUTCDate();

  return format(Date.UTC(year, month - 1 + months, Math.min(day, lastDay)));
}

export function subtractDays(date: IsoDate, days: number): IsoDate {
  return format(toTimestamp(date) - days * millisecondsPerDay);
}

// Días de calendario de start a end; negativo si end es anterior.
export function daysBetween(start: IsoDate, end: IsoDate): number {
  return (toTimestamp(end) - toTimestamp(start)) / millisecondsPerDay;
}

function parse(date: IsoDate): number[] {
  if (!isIsoDate(date)) throw new ValidationError('La fecha debe tener el formato YYYY-MM-DD.');
  return date.split('-').map(Number);
}

function toTimestamp(date: IsoDate): number {
  const [year, month, day] = parse(date);
  return Date.UTC(year, month - 1, day);
}

function format(timestamp: number): IsoDate {
  const date = new Date(timestamp);
  const value = Number.isNaN(timestamp) || Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  if (!isIsoDate(value)) throw new ValidationError('La fecha calculada está fuera de rango.');
  return value;
}
