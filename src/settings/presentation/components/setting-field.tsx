import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  icon: IconName;
  sample?: string;
  divider?: boolean;
  children: ReactNode;
}

export function SettingField({ label, icon, sample, divider = false, children }: Props) {
  const colors = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.field, divider && styles.divider]}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Icon name={icon} color={colors.body} />
          <AppText style={styles.label}>{label}</AppText>
        </View>
        {sample && <AppText style={styles.sample}>{sample}</AppText>}
      </View>
      {children}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  field: { padding: 14, gap: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: c.line06 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: fonts.sansMedium, fontSize: 15 },
  sample: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
}));
