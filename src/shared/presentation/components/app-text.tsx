import { Text, type TextProps } from 'react-native';

import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

export function AppText({ style, ...props }: TextProps) {
  const colors = useTheme();
  return <Text {...props} style={[{ fontFamily: fonts.sans, fontSize: 16, color: colors.ink }, style]} />;
}
