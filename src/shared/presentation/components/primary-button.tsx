import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  label: string;
  icon?: IconName;
  onPress: () => void;
  height?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, icon, onPress, height = 54, disabled = false, style }: Props) {
  const colors = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          height,
          borderRadius: 16,
          backgroundColor: colors.ink,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: pressed || disabled ? 0.85 : 1,
        },
        style,
      ]}>
      {icon && <Icon name={icon} size={16} color={colors.paper} />}
      <AppText style={{ fontFamily: fonts.sansMedium, fontSize: 16, color: colors.paper }}>{label}</AppText>
    </Pressable>
  );
}
