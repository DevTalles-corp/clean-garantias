import { Pressable, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  icon: IconName;
  detail: string;
  value: boolean;
  onPress: () => void;
  monoDetail?: boolean;
}

export function SwitchRow({ label, icon, detail, value, onPress, monoDetail = false }: Props) {
  const colors = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPress={onPress}
      style={styles.row}>
      <Icon name={icon} color={colors.body} />
      <View style={styles.texts}>
        <AppText style={styles.label}>{label}</AppText>
        <AppText style={[styles.detail, monoDetail && styles.monoDetail]}>{detail}</AppText>
      </View>
      <View style={[styles.track, value && styles.trackOn]}>
        <Animated.View
          style={[
            styles.knob,
            {
              transform: [{ translateX: value ? 18 : 0 }],
              transitionProperty: 'transform',
              transitionDuration: 200,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: c.line06,
  },
  texts: { flex: 1, gap: 2 },
  label: { fontFamily: fonts.sansMedium, fontSize: 15 },
  detail: { fontSize: 12.5, color: c.muted },
  monoDetail: { fontFamily: fonts.mono, fontSize: 12 },
  track: { width: 46, height: 28, borderRadius: 999, backgroundColor: c.switchOff },
  trackOn: { backgroundColor: c.green },
  knob: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: c.white,
    boxShadow: `0 1px 3px ${c.black25}`,
  },
}));
