import type { Warranty } from '@/warranties/domain/entities/warranty.entity';

export function formatDue(daysLeft: number): string {
  if (daysLeft < 0) return `hace ${-daysLeft} d`;
  if (daysLeft === 0) return 'hoy';
  return daysLeft <= 60 ? `en ${daysLeft} d` : `en ${Math.round(daysLeft / 30)} m`;
}

export function formatDueLong(daysLeft: number): string {
  if (daysLeft < 0) return `Venció hace ${-daysLeft} días`;
  return daysLeft === 0 ? 'Vence hoy' : `Faltan ${daysLeft} días de cobertura`;
}

export function formatWarrantyLabel(warranty: Warranty): string {
  switch (warranty.type) {
    case 'manufacturer':
      return 'Garantía de fábrica';
    case 'store':
      return 'Meses extra';
    case 'extended':
      return `Póliza · ${warranty.provider}`;
  }
}
