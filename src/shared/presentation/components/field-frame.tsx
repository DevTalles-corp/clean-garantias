import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { FieldError } from '@/shared/presentation/components/field-error';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  label: string;
  error?: string;
  detected?: boolean;
  children: ReactNode;
}

export function FieldFrame({ label, error, detected, children }: Props) {
  const colors = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText style={{ fontFamily: fonts.sansMedium, fontSize: 13, color: colors.body }}>{label}</AppText>
        {detected && (
          <AppText style={{ fontFamily: fonts.monoMedium, fontSize: 10, color: colors.green }}>DETECTADO</AppText>
        )}
      </View>
      {children}
      <FieldError message={error} />
    </View>
  );
}
