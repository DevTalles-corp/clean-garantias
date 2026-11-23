import { View } from 'react-native';

import type { PurchaseSummary } from '@/products/presentation/models/purchase';
import { AppText } from '@/shared/presentation/components/app-text';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatMoney } from '@/shared/presentation/formatters/format-money';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';

export function ProtectedMoneyCard({ summary }: { summary: PurchaseSummary }) {
  const colors = useTheme();
  const styles = useStyles();
  const { active, expiring, expired, total } = summary;
  const [mainTotal, ...otherTotals] = summary.protectedTotals;

  return (
    <View style={styles.card}>
      <SectionLabel size={12} style={{ color: colors.inkLabel }}>
        Dinero protegido
      </SectionLabel>
      <AppText adjustsFontSizeToFit numberOfLines={1} style={styles.amount}>
        {formatMoney(mainTotal)}
      </AppText>
      {otherTotals.length > 0 && (
        <AppText style={styles.otherAmounts}>+ {otherTotals.map(formatMoney).join(' + ')}</AppText>
      )}
      <AppText style={styles.detail}>
        en {active + expiring} garantías activas de {total} compras
      </AppText>
      <View style={styles.bar}>
        <View style={{ flex: active, backgroundColor: colors.greenBar }} />
        <View style={{ flex: expiring, backgroundColor: colors.amberBar }} />
        <View style={{ flex: expired, backgroundColor: colors.redBar }} />
      </View>
      <View style={styles.legend}>
        <Legend label={`${active} vigentes`} color={colors.inkBody} />
        <Legend label={`${expiring} por vencer`} color={colors.amberBar} />
        <Legend label={`${expired} vencidas`} color={colors.redBar} />
      </View>
    </View>
  );
}

function Legend({ label, color }: { label: string; color: string }) {
  const styles = useStyles();
  return (
    <AppText style={[styles.legendText, { color }]}>
      <AppText style={[styles.legendText, { color, fontFamily: fonts.symbol }]}>●</AppText> {label}
    </AppText>
  );
}

const useStyles = makeStyles((c) => ({
  card: { backgroundColor: c.ink, borderRadius: 22, padding: 20, gap: 14 },
  amount: { fontFamily: fonts.monoMedium, fontSize: 40, lineHeight: 40, letterSpacing: -1.2, color: c.paper },
  otherAmounts: { fontFamily: fonts.monoMedium, fontSize: 16, color: c.paper },
  detail: { fontSize: 14, color: c.inkBody },
  bar: { flexDirection: 'row', height: 8, borderRadius: 8, overflow: 'hidden', gap: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  legendText: { fontFamily: fonts.mono, fontSize: 12 },
}));
