import { Pressable } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  onPress: () => void;
  detail?: string;
  divider?: boolean;
  destructive?: boolean;
}

export function SettingAction({ label, onPress, detail, divider = false, destructive = false }: Props) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, divider && styles.divider, pressed && styles.pressed]}>
      <AppText style={[styles.label, destructive && styles.destructive]}>{label}</AppText>
      {detail && <AppText style={styles.detail}>{detail}</AppText>}
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: c.line06 },
  pressed: { opacity: 0.6 },
  label: { fontSize: 15 },
  destructive: { color: c.red },
  detail: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
}));
