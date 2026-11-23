// Traduce el SF Symbol guardado en `Category.icon` al catálogo de iconos.

import type { IconName } from '@/shared/presentation/constants/icons';

const categoryIcons = new Map<string, IconName>([
  ['laptopcomputer', 'categoryTech'],
  ['refrigerator', 'categoryAppliances'],
  ['sofa', 'categoryHome'],
  ['hammer', 'categoryTools'],
  ['bicycle', 'categorySports'],
  ['shippingbox', 'categoryOther'],
]);

export function getCategoryIcon(icon: string): IconName {
  return categoryIcons.get(icon) ?? 'categoryOther';
}
