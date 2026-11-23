import { ScrollView } from 'react-native';

import { Chip } from '@/shared/presentation/components/chip';

interface Props {
  options: readonly string[];
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
      {options.map((option) => (
        <Chip key={option} label={option} selected={option === value} onPress={() => onChange(option)} />
      ))}
    </ScrollView>
  );
}
