import { Pressable, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';

interface Props {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function TextButton({ label, onPress, style, textStyle }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, style]}>
      <AppText style={textStyle}>{label}</AppText>
    </Pressable>
  );
}
