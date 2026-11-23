import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

// Sin error conserva un espacio vacío para que el formulario no cambie de ritmo.
export function FieldError({ message }: { message?: string }) {
  const colors = useTheme();
  if (!message) return <View />;
  return (
    <AppText accessibilityRole="alert" style={{ fontSize: 12.5, color: colors.red }}>
      {message}
    </AppText>
  );
}
