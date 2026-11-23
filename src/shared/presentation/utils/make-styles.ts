// Crea los estilos de un componente una vez por tema.

import { StyleSheet, type TextStyle } from 'react-native';

import { palettes, type ColorScheme, type Palette } from '@/shared/presentation/constants/theme';
import { useScheme } from '@/shared/presentation/providers/theme.context';

// TextStyle incluye todas las propiedades de ViewStyle.
export function makeStyles<const T extends Record<string, TextStyle>>(
  factory: (colors: Palette) => T,
): () => T {
  const styles: Record<ColorScheme, T> = {
    light: StyleSheet.create(factory(palettes.light)) as T,
    dark: StyleSheet.create(factory(palettes.dark)) as T,
  };
  return function useStyles() {
    return styles[useScheme()];
  };
}
