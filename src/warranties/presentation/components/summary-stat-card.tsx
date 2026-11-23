import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Card } from '@/shared/presentation/components/card';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import type { IconName } from '@/shared/presentation/constants/icons';
import { useTheme } from '@/shared/presentation/hooks/use-theme';

interface Props {
  value: number;
  label: string;
  icon: IconName;
  highlighted?: boolean;
}

export function SummaryStatCard({ value, label, icon, highlighted = false }: Props) {
  const colors = useTheme();
  return (
    <Card style={{ flex: 1, padding: 16, gap: 6 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText
          style={{
            fontFamily: fonts.monoMedium,
            fontSize: 32,
            lineHeight: 32,
            color: highlighted ? colors.amber : colors.ink,
          }}>
          {value}
        </AppText>
        <Icon name={icon} color={highlighted ? colors.amber : colors.body} />
      </View>
      <AppText style={{ fontSize: 13, color: colors.body }}>{label}</AppText>
    </Card>
  );
}
