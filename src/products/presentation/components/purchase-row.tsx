import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Purchase } from '@/products/presentation/models/purchase';
import { AppText } from '@/shared/presentation/components/app-text';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { formatMoney } from '@/shared/presentation/formatters/format-money';
import { makeStyles } from '@/shared/presentation/utils/make-styles';
import { WarrantyStatusBadge } from '@/warranties/presentation/components/warranty-status-badge';
import { formatDue } from '@/warranties/presentation/formatters/format-warranty';

interface Props {
  purchase: Purchase;
  variant: 'list' | 'card';
}

export function PurchaseRow({ purchase, variant }: Props) {
  const styles = useStyles();
  const detail =
    variant === 'list' ? `vence ${formatDate(purchase.endDate)}` : formatMoney(purchase.product.purchasePrice);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/products/[id]', params: { id: purchase.id } })}
      style={({ pressed }) => [
        styles.row,
        variant === 'list' ? styles.listRow : styles.cardRow,
        pressed && styles.pressed,
      ]}>
      <View style={styles.tile}>
        <AppText style={styles.code}>{purchase.categoryCode}</AppText>
      </View>
      <View style={styles.texts}>
        <AppText numberOfLines={1} style={styles.name}>
          {purchase.product.name}
        </AppText>
        <AppText numberOfLines={variant === 'card' ? 1 : undefined} style={styles.detail}>
          {purchase.storeName} · {detail}
        </AppText>
      </View>
      <View style={styles.status}>
        <WarrantyStatusBadge status={purchase.status} />
        <AppText style={styles.due}>{formatDue(purchase.daysLeft)}</AppText>
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((c) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  listRow: { borderBottomWidth: 1, borderBottomColor: c.line06 },
  cardRow: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line08, borderRadius: 16 },
  pressed: { backgroundColor: c.surfacePressed },
  tile: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: c.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  code: { fontFamily: fonts.monoMedium, fontSize: 11, color: c.body },
  texts: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontFamily: fonts.sansMedium, fontSize: 15 },
  detail: { fontSize: 12.5, color: c.muted },
  status: { alignItems: 'flex-end', gap: 4 },
  due: { fontFamily: fonts.mono, fontSize: 12, color: c.body },
}));
