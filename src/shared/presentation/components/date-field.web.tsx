import { FieldFrame } from '@/shared/presentation/components/field-frame';
import type { DateFieldProps } from '@/shared/presentation/components/date-field.types';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useScheme } from '@/shared/presentation/providers/theme.context';

export function DateField({ label, value, max, onChange, error, detected = false }: DateFieldProps) {
  const colors = useTheme();
  const scheme = useScheme();
  const borderColor = error ? colors.redBorder : detected ? colors.greenBar : colors.line15;

  return (
    <FieldFrame label={label} error={error} detected={detected}>
      <input
        type="date"
        aria-label={label}
        value={value}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        style={{
          height: 48,
          width: '100%',
          boxSizing: 'border-box',
          borderRadius: 12,
          border: `1px solid ${borderColor}`,
          background: colors.surface,
          padding: '0 13px',
          fontFamily: fonts.sans,
          fontSize: 16,
          outline: 'none',
          color: colors.ink,
          colorScheme: scheme,
        }}
      />
    </FieldFrame>
  );
}
