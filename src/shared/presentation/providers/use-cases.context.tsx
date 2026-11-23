// Entrega los casos de uso a los hooks; los crea el punto de composición.

import { createContext, useContext, type ReactNode } from 'react';

import type { AppUseCases } from '@/app.composition';

const UseCasesContext = createContext<AppUseCases | null>(null);

export function UseCasesProvider(props: { useCases: AppUseCases; children: ReactNode }) {
  return <UseCasesContext value={props.useCases}>{props.children}</UseCasesContext>;
}

export function useUseCases(): AppUseCases {
  const useCases = useContext(UseCasesContext);
  if (!useCases) throw new Error('UseCasesProvider no está montado');
  return useCases;
}
