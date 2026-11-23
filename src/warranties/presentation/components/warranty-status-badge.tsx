import { View } from 'react-native';

import { AppText } from '@/shared/presentation/components/app-text';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import type { WarrantyStatus } from '@/warranties/domain/entities/warranty.entity';
import { statusColors, statusIcons, statusLabels } from '@/warranties/presentation/constants/status-labels';

export function WarrantyStatusBadge({ status, large = false }: { status: WarrantyStatus; large?: boolean }) {
  const colors = useTheme();
  const { text, background } = statusColors[status];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors[background],
        borderRadius: large ? 7 : 6,
        paddingVertical: large ? 4 : 3,
        paddingHorizontal: large ? 8 : 7,
      }}>
      <Icon name={statusIcons[status]} size={12} color={colors[text]} />
      <AppText style={{ fontFamily: fonts.monoMedium, fontSize: large ? 12 : 11, color: colors[text] }}>
        {statusLabels[status]}
      </AppText>
    </View>
  );
}
