import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// '2026-11-19' → '19 nov 2026'
export function formatDate(date: IsoDate): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}
