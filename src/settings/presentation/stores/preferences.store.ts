// Preferencia de la interfaz que no pertenece a la entidad Settings.
// localStorage lo aporta el navegador o expo-sqlite en el dispositivo.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PreferencesState {
  defaultMonths: number;
  setDefaultMonths: (months: number) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      defaultMonths: 12,
      setDefaultMonths: (defaultMonths) => set({ defaultMonths }),
    }),
    { name: 'mis-garantias.preferences', storage: createJSONStorage(() => localStorage) },
  ),
);
