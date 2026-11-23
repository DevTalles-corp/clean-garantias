import Animated from 'react-native-reanimated';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { useScreenInsets } from '@/shared/presentation/hooks/use-screen-insets';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useToastStore } from '@/shared/presentation/stores/toast.store';

export function Toast() {
  const colors = useTheme();
  const { top } = useScreenInsets();
  const message = useToastStore((state) => state.message);
  const type = useToastStore((state) => state.type);
  if (!message) return null;

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: top - 2,
        left: 20,
        right: 20,
        zIndex: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.ink,
        borderRadius: 14,
        paddingVertical: 13,
        paddingHorizontal: 15,
        boxShadow: `0 10px 30px ${colors.black25}`,
        animationName: {
          from: { opacity: 0, transform: [{ translateY: -12 }] },
          to: { opacity: 1, transform: [{ translateY: 0 }] },
        },
        animationDuration: 250,
        animationTimingFunction: 'ease-out',
      }}>
      <Icon name={type === 'success' ? 'active' : 'info'} color={colors.paper} />
      <AppText style={{ flex: 1, fontSize: 14, color: colors.paper }}>{message}</AppText>
    </Animated.View>
  );
}
