import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  sample?: string;
  divider?: boolean;
  children: ReactNode;
}

export function SettingField({ label, sample, divider = false, children }: Props) {
  const styles = useStyles();
  return (
    <View style={[styles.field, divider && styles.divider]}>
      <View style={styles.header}>
        <AppText style={styles.label}>{label}</AppText>
        {sample && <AppText style={styles.sample}>{sample}</AppText>}
      </View>
      {children}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  field: { padding: 14, gap: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: c.line06 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  label: { fontFamily: fonts.sansMedium, fontSize: 15 },
  sample: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
}));
