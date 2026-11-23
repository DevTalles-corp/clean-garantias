import { Pressable, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  label: string;
  onPress: () => void;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function TextButton({ label, onPress, icon, iconPosition = 'start', style, textStyle }: Props) {
  const colors = useTheme();
  // El icono usa el color del texto.
  const textColor = StyleSheet.flatten(textStyle)?.color;
  const color = typeof textColor === 'string' ? textColor : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: pressed ? 0.6 : 1 },
        style,
      ]}>
      {icon && iconPosition === 'start' && <Icon name={icon} size={16} color={color} />}
      <AppText style={textStyle}>{label}</AppText>
      {icon && iconPosition === 'end' && <Icon name={icon} size={16} color={color} />}
    </Pressable>
  );
}
