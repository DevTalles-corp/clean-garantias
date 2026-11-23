import { TextInput, View, type TextInputProps } from 'react-native';

import { FieldFrame } from '@/shared/presentation/components/field-frame';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props extends Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'inputMode'> {
  label: string;
  error?: string;
  detected?: boolean;
}

export function TextField({ label, error, detected = false, ...input }: Props) {
  const colors = useTheme();
  const styles = useFieldStyles();
  return (
    <FieldFrame label={label} error={error} detected={detected}>
      <View>
        <TextInput
          {...input}
          accessibilityLabel={label}
          placeholderTextColor={colors.receiptMuted}
          style={[styles.input, detected && styles.detected, !!error && styles.invalid]}
        />
      </View>
    </FieldFrame>
  );
}

export const useFieldStyles = makeStyles((c) => ({
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.line15,
    backgroundColor: c.surface,
    paddingHorizontal: 13,
    paddingVertical: 0,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: c.ink,
    outlineWidth: 0,
  },
  detected: { borderColor: c.greenBar },
  invalid: { borderColor: c.redBorder },
}));
