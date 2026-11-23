// Márgenes seguros; en web se usan los de la referencia.

import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useScreenInsets() {
  const { top, bottom } = useSafeAreaInsets();
  return { top: top || 60, bottom: Math.max(bottom, 30) };
}
