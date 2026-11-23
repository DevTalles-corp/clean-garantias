import { Pressable } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  icon: IconName;
  onPress: () => void;
  detail?: string;
  divider?: boolean;
  destructive?: boolean;
}

export function SettingAction({ label, icon, onPress, detail, divider = false, destructive = false }: Props) {
  const colors = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, divider && styles.divider, pressed && styles.pressed]}>
      <Icon name={icon} color={destructive ? colors.red : colors.body} />
      <AppText style={[styles.label, destructive && styles.destructive]}>{label}</AppText>
      {detail && <AppText style={styles.detail}>{detail}</AppText>}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 15, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: c.line06 },
  pressed: { opacity: 0.6 },
  label: { flex: 1, fontSize: 15 },
  destructive: { color: c.red },
  detail: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
}));
