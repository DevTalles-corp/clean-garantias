// Tema activo de la interfaz. Se elige en Ajustes.

import { createContext, useContext, type ReactNode } from 'react';

import type { ColorScheme } from '@/shared/presentation/constants/theme';

const ThemeContext = createContext<ColorScheme>('light');

export function AppThemeProvider(props: { scheme: ColorScheme; children: ReactNode }) {
  return <ThemeContext value={props.scheme}>{props.children}</ThemeContext>;
}

export function useScheme(): ColorScheme {
  return useContext(ThemeContext);
}
