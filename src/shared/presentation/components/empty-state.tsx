import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

export function EmptyState({ message }: { message: string }) {
  const colors = useTheme();
  return (
    <View
      style={{
        alignItems: 'center',
        gap: 8,
        paddingVertical: 36,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.line20,
        borderRadius: 16,
      }}>
      <Icon name="empty" color={colors.muted} />
      <AppText style={{ fontSize: 14, color: colors.muted, textAlign: 'center' }}>{message}</AppText>
    </View>
  );
}
