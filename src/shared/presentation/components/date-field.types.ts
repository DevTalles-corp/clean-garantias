import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export interface DateFieldProps {
  label: string;
  value: IsoDate;
  max: IsoDate;
  onChange: (date: IsoDate) => void;
  error?: string;
  detected?: boolean;
}
