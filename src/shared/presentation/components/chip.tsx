import { Pressable } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

interface Props {
  label: string;
  selected: boolean;
  onPress: () => void;
  variant?: 'filter' | 'form' | 'months' | 'extension';
}

export function Chip({ label, selected, onPress, variant = 'filter' }: Props) {
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
    borderWidth: 1,
    borderColor: c.line15,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: c.surface,
  },
  tall: { paddingVertical: 8 },
  block: { flex: 1, alignItems: 'center', paddingHorizontal: 0, borderRadius: 10 },
  extension: { paddingVertical: 10 },
  selected: { backgroundColor: c.ink, borderColor: c.ink },
  label: { fontSize: 13, color: c.body },
  mono: { fontFamily: fonts.monoMedium },
  extensionLabel: { fontSize: 14 },
  selectedLabel: { color: c.paper },
}));
