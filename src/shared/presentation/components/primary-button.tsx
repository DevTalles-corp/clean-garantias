import { Pressable, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  label: string;
  onPress: () => void;
  height?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, onPress, height = 54, disabled = false, style }: Props) {
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
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed || disabled ? 0.85 : 1,
        },
        style,
      ]}>
      <AppText style={{ fontFamily: fonts.sansMedium, fontSize: 16, color: colors.paper }}>{label}</AppText>
    </Pressable>
  );
}
