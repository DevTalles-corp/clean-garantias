import type { Palette } from '@/shared/presentation/constants/theme';
import type { WarrantyStatus, WarrantyType } from '@/warranties/domain/entities/warranty.entity';

export const statusLabels: Record<WarrantyStatus, string> = {
  active: 'Vigente',
  expiring: 'Por vencer',
  expired: 'Vencida',
};

export const statusColors: Record<WarrantyStatus, { text: keyof Palette; background: keyof Palette }> = {
  active: { text: 'green', background: 'greenSoft' },
  expiring: { text: 'amber', background: 'amberSoft' },
  expired: { text: 'red', background: 'redSoft' },
};

export const segmentColors: Record<WarrantyType, keyof Palette> = {
  manufacturer: 'ink',
  store: 'greenBar',
  extended: 'amberBar',
};
