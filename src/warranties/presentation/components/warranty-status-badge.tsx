import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import type { WarrantyStatus } from '@/warranties/domain/entities/warranty.entity';
import { statusColors, statusLabels } from '@/warranties/presentation/constants/status-labels';

export function WarrantyStatusBadge({ status, large = false }: { status: WarrantyStatus; large?: boolean }) {
  const colors = useTheme();
  const { text, background } = statusColors[status];
  return (
    <View
      style={{
        backgroundColor: colors[background],
        borderRadius: large ? 7 : 6,
        paddingVertical: large ? 4 : 3,
        paddingHorizontal: large ? 8 : 7,
      }}>
      <AppText style={{ fontFamily: fonts.monoMedium, fontSize: large ? 12 : 11, color: colors[text] }}>
        {statusLabels[status]}
      </AppText>
    </View>
  );
}
