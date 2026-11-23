// Categorías iniciales, en el orden en que se muestran.

import type { CreateCategoryData } from '@/categories/domain/entities/category.entity';

export const defaultCategories: readonly CreateCategoryData[] = [
  { name: 'Tecnología', icon: 'laptopcomputer', color: '#22694C', defaultWarrantyMonths: 12 },
  { name: 'Electrodomésticos', icon: 'refrigerator', color: '#8A5208', defaultWarrantyMonths: 12 },
  { name: 'Hogar', icon: 'sofa', color: '#7FBF9B', defaultWarrantyMonths: 12 },
  { name: 'Herramientas', icon: 'hammer', color: '#E7A93F', defaultWarrantyMonths: 12 },
  { name: 'Deportes', icon: 'bicycle', color: '#D9735E', defaultWarrantyMonths: 12 },
  { name: 'Otros', icon: 'shippingbox', color: '#6E6A60', defaultWarrantyMonths: 12 },
];
