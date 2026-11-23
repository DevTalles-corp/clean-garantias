import type { StyleProp, TextStyle } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  children: string;
  size?: 11 | 12;
  style?: StyleProp<TextStyle>;
}

export function SectionLabel({ children, size = 11, style }: Props) {
  const colors = useTheme();
  return (
    <AppText
      style={[
        {
          fontFamily: fonts.monoMedium,
          fontSize: size,
          color: colors.muted,
          textTransform: 'uppercase',
          letterSpacing: size * 0.06,
        },
        style,
      ]}>
      {children}
    </AppText>
  );
}
