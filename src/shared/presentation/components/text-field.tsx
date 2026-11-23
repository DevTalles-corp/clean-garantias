import { TextInput, View, type TextInputProps } from 'react-native';

import { FieldFrame } from '@/shared/presentation/components/field-frame';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props extends Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'inputMode'> {
  label: string;
  icon?: IconName;
  error?: string;
  detected?: boolean;
}

export function TextField({ label, icon, error, detected = false, ...input }: Props) {
  const colors = useTheme();
  const styles = useFieldStyles();
  return (
    <FieldFrame label={label} error={error} detected={detected}>
      <View>
        <TextInput
          {...input}
          accessibilityLabel={label}
          placeholderTextColor={colors.receiptMuted}
          style={[styles.input, !!icon && styles.inputWithIcon, detected && styles.detected, !!error && styles.invalid]}
        />
        {icon && (
          <View pointerEvents="none" style={styles.icon}>
            <Icon name={icon} color={colors.muted} />
          </View>
        )}
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
  inputWithIcon: { paddingLeft: 41 },
  icon: { position: 'absolute', left: 13, top: 14 },
  detected: { borderColor: c.greenBar },
  invalid: { borderColor: c.redBorder },
}));
