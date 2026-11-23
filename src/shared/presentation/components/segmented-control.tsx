import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

export interface Option<T> {
  value: T;
  label: string;
}

interface Props<T> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'filter' | 'sheet' | 'setting';
}

export function SegmentedControl<T extends string | number>(props: Props<T>) {
  const { options, value, onChange, variant = 'filter' } = props;
  const styles = useStyles();
  const isSetting = variant === 'setting';

  return (
    <View style={[styles.track, isSetting && styles.settingTrack]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              isSetting && styles.settingOption,
              variant === 'sheet' && styles.sheetOption,
              selected && styles.selected,
            ]}>
            <AppText
              numberOfLines={1}
              style={[
                styles.label,
                isSetting && styles.settingLabel,
                variant === 'sheet' && styles.sheetLabel,
                selected && styles.selectedLabel,
              ]}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  track: { flexDirection: 'row', backgroundColor: c.track, borderRadius: 12, padding: 3, gap: 2 },
  settingTrack: { backgroundColor: c.trackSoft, borderRadius: 10 },
  option: { flex: 1, alignItems: 'center', borderRadius: 9, paddingVertical: 8 },
  settingOption: { borderRadius: 8 },
  sheetOption: { paddingVertical: 9 },
  selected: { backgroundColor: c.surface, boxShadow: `0 1px 3px ${c.shadow15}` },
  label: { fontFamily: fonts.sansMedium, fontSize: 13, color: c.body },
  settingLabel: { fontFamily: fonts.sans },
  sheetLabel: { fontSize: 14 },
  selectedLabel: { color: c.ink },
}));
