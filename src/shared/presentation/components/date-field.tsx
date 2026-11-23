import DateTimePicker from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, Pressable } from 'react-native';

import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import { AppText } from '@/shared/presentation/components/app-text';
import type { DateFieldProps } from '@/shared/presentation/components/date-field.types';
import { FieldFrame } from '@/shared/presentation/components/field-frame';
import { useFieldStyles } from '@/shared/presentation/components/text-field';
import { formatDate } from '@/shared/presentation/formatters/format-date';

function toDate(date: IsoDate): Date {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
}

function toIsoDate(date: Date): IsoDate {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function DateField({ label, value, max, onChange, error, detected = false }: DateFieldProps) {
  const styles = useFieldStyles();
  const [isOpen, setIsOpen] = useState(false);
  const isAndroid = Platform.OS === 'android';

  return (
    <FieldFrame label={label} error={error} detected={detected}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setIsOpen((open) => !open)}
        style={[
          styles.input,
          { justifyContent: 'center' },
          detected && styles.detected,
          !!error && styles.invalid,
        ]}>
        <AppText>{value ? formatDate(value) : 'Elige una fecha'}</AppText>
      </Pressable>
      {isOpen && (
        <DateTimePicker
          value={toDate(value || max)}
          maximumDate={toDate(max)}
          display={isAndroid ? 'default' : 'inline'}
          presentation={isAndroid ? 'dialog' : 'inline'}
          onDismiss={() => setIsOpen(false)}
          onValueChange={(_event, date) => {
            setIsOpen(false);
            onChange(toIsoDate(date));
          }}
        />
      )}
    </FieldFrame>
  );
}
