import { ScrollView } from 'react-native';

import { Chip } from '@/shared/presentation/components/chip';
import type { IconName } from '@/shared/presentation/constants/icons';

interface FilterOption {
  label: string;
  icon?: IconName;
}

interface Props {
  options: readonly FilterOption[];
  value: string | null; // null: todas
  onChange: (value: string | null) => void;
}

export function FilterChips({ options, value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{ marginHorizontal: -20, flexGrow: 0 }}
      contentContainerStyle={{ gap: 6, paddingHorizontal: 20, paddingBottom: 2 }}>
      <Chip label="Todas" selected={value === null} onPress={() => onChange(null)} />
      {options.map(({ label, icon }) => (
        <Chip key={label} label={label} icon={icon} selected={label === value} onPress={() => onChange(label)} />
      ))}
    </ScrollView>
  );
}
