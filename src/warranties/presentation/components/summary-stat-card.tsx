import { AppText } from '@/shared/presentation/components/app-text';
import { Card } from '@/shared/presentation/components/card';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  value: number;
  label: string;
  highlighted?: boolean;
}

export function SummaryStatCard({ value, label, highlighted = false }: Props) {
  const colors = useTheme();
  return (
    <Card style={{ flex: 1, padding: 16, gap: 6 }}>
      <AppText
        style={{
          fontFamily: fonts.monoMedium,
          fontSize: 32,
          lineHeight: 32,
          color: highlighted ? colors.amber : colors.ink,
        }}>
        {value}
      </AppText>
      <AppText style={{ fontSize: 13, color: colors.body }}>{label}</AppText>
    </Card>
  );
}
