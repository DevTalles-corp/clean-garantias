import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

// Sin error conserva un espacio vacío para que el formulario no cambie de ritmo.
export function FieldError({ message }: { message?: string }) {
  const colors = useTheme();
  if (!message) return <View />;
  return (
    <View accessible accessibilityRole="alert" style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Icon name="error" size={16} color={colors.red} />
      <AppText style={{ flexShrink: 1, fontSize: 12.5, color: colors.red }}>{message}</AppText>
    </View>
  );
}
