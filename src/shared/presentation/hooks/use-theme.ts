import { palettes, type Palette } from '@/shared/presentation/constants/theme';
import { useScheme } from '@/shared/presentation/providers/theme.context';

export function useTheme(): Palette {
  return palettes[useScheme()];
}
