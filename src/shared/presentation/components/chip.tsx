import { Pressable } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
  variant?: 'filter' | 'form' | 'months' | 'extension';
}

export function Chip({ label, icon, selected, onPress, variant = 'filter' }: Props) {
  const colors = useTheme();
  const styles = useStyles();
  const isBlock = variant === 'months' || variant === 'extension';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        variant !== 'filter' && styles.tall,
        isBlock && styles.block,
        variant === 'extension' && styles.extension,
        selected && styles.selected,
      ]}>
      {icon && <Icon name={icon} size={16} color={selected ? colors.paper : colors.body} />}
      <AppText
        style={[
          styles.label,
          isBlock && styles.mono,
          variant === 'extension' && styles.extensionLabel,
          selected && styles.selectedLabel,
        ]}>
        {label}
      </AppText>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: c.line15,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: c.surface,
  },
  tall: { paddingVertical: 8 },
  block: { flex: 1, justifyContent: 'center', paddingHorizontal: 0, borderRadius: 10 },
  extension: { paddingVertical: 10 },
  selected: { backgroundColor: c.ink, borderColor: c.ink },
  label: { fontSize: 13, color: c.body },
  mono: { fontFamily: fonts.monoMedium },
  extensionLabel: { fontSize: 14 },
  selectedLabel: { color: c.paper },
}));
