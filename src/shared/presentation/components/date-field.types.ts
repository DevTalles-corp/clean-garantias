import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import type { IconName } from '@/shared/presentation/constants/icons';

export interface DateFieldProps {
  label: string;
  icon?: IconName;
  value: IsoDate;
  max: IsoDate;
  onChange: (date: IsoDate) => void;
  error?: string;
  detected?: boolean;
}
