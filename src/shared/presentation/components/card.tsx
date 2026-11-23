import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/shared/presentation/hooks/use-theme';

export function Card({ style, ...props }: ViewProps) {
  const colors = useTheme();
  return (
    <View
      {...props}
      style={[
        { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line08, borderRadius: 18 },
        style,
      ]}
    />
  );
}
