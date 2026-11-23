// Filtros de la lista de compras.

import { create } from 'zustand';

import type { PurchaseFilters } from '@/products/presentation/models/purchase';

const initialFilters: PurchaseFilters = { query: '', category: null, store: null, status: null };

interface PurchaseFiltersState extends PurchaseFilters {
  setFilters: (changes: Partial<PurchaseFilters>) => void;
  clearFilters: () => void;
}

export const usePurchaseFiltersStore = create<PurchaseFiltersState>((set) => ({
  ...initialFilters,
  setFilters: (changes) => set(changes),
  clearFilters: () => set(initialFilters),
}));
