// Validador de dominio: duración permitida de una garantía, en meses.
// La comparten Warranty y Category; sin él, una categoría podría sugerir una duración inválida.

export const minWarrantyMonths = 1;
export const maxWarrantyMonths = 240;

export function isWarrantyDuration(months: number): boolean {
  return Number.isInteger(months) && months >= minWarrantyMonths && months <= maxWarrantyMonths;
}
