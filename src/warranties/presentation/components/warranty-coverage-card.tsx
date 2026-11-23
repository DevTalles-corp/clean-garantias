import { Pressable, View } from 'react-native';

import { daysBetween, type IsoDate } from '@/shared/domain/value-objects/iso-date';
import { AppText } from '@/shared/presentation/components/app-text';
import { Card } from '@/shared/presentation/components/card';
import { Icon } from '@/shared/presentation/components/icon';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';
import type { Warranty, WarrantyStatus } from '@/warranties/domain/entities/warranty.entity';
import { WarrantyStatusBadge } from '@/warranties/presentation/components/warranty-status-badge';
import { segmentColors } from '@/warranties/presentation/constants/status-labels';
import { formatDueLong, formatWarrantyLabel } from '@/warranties/presentation/formatters/format-warranty';

interface Props {
  warranties: readonly Warranty[];
  purchaseDate: IsoDate;
  endDate: IsoDate;
  daysLeft: number;
  status: WarrantyStatus;
  today: IsoDate;
  onExtend: () => void;
}

export function WarrantyCoverageCard(props: Props) {
  const { warranties, purchaseDate, endDate, daysLeft, status, today, onExtend } = props;
  const colors = useTheme();
  const styles = useStyles();
  const total = Math.max(1, daysBetween(purchaseDate, endDate));
  const progress = Math.min(1, Math.max(0, daysBetween(purchaseDate, today) / total));
  const left = `${progress * 100}%` as const;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={{ gap: 4 }}>
          <AppText style={styles.caption}>Vence el</AppText>
          <AppText style={styles.endDate}>{formatDate(endDate)}</AppText>
        </View>
        <WarrantyStatusBadge status={status} large />
      </View>

      <View style={{ paddingTop: 14 }}>
        <View style={[styles.todayAnchor, { left }]}>
          <AppText style={styles.todayLabel}>HOY</AppText>
        </View>
        <View style={styles.bar}>
          {warranties.map((warranty) => (
            <View
              key={warranty.id}
              style={{
                flex: warranty.durationMonths,
                backgroundColor: colors[segmentColors[warranty.type]],
                borderRadius: 4,
              }}
            />
          ))}
        </View>
        <View style={[styles.todayLine, { left }]} />
      </View>

      <AppText style={styles.due}>{formatDueLong(daysLeft)}</AppText>

      <View style={styles.segments}>
        {warranties.map((warranty) => (
          <View key={warranty.id} style={styles.segment}>
            <View style={[styles.dot, { backgroundColor: colors[segmentColors[warranty.type]] }]} />
            <View style={styles.segmentTexts}>
              <AppText style={styles.segmentLabel}>{formatWarrantyLabel(warranty)}</AppText>
              <View style={styles.range}>
                <AppText style={styles.segmentRange}>{formatDate(warranty.startDate)}</AppText>
                <Icon name="arrow" size={12} color={colors.muted} />
                <AppText style={styles.segmentRange}>{formatDate(warranty.endDate)}</AppText>
              </View>
            </View>
            <AppText style={styles.segmentMonths}>+{warranty.durationMonths} m</AppText>
          </View>
        ))}
      </View>

      <Pressable accessibilityRole="button" onPress={onExtend} style={styles.extend}>
        <Icon name="add" size={16} color={colors.ink} />
        <AppText style={styles.segmentLabel}>Extender garantía</AppText>
      </Pressable>
    </Card>
  );
}

const useStyles = makeStyles((c) => ({
  card: { borderRadius: 20, padding: 18, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  caption: { fontSize: 13, color: c.muted },
  endDate: { fontFamily: fonts.displaySemi, fontSize: 22 },
  todayAnchor: { position: 'absolute', top: 0, width: 40, marginLeft: -20, alignItems: 'center' },
  todayLabel: { fontFamily: fonts.monoMedium, fontSize: 10 },
  todayLine: { position: 'absolute', top: 13, bottom: -4, width: 2, marginLeft: -1, backgroundColor: c.ink },
  bar: { flexDirection: 'row', gap: 3, height: 12 },
  due: { fontFamily: fonts.mono, fontSize: 13, color: c.body },
  segments: { borderTopWidth: 1, borderTopColor: c.line08 },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: c.line06,
  },
  dot: { width: 10, height: 10, borderRadius: 3 },
  segmentTexts: { flex: 1, gap: 1 },
  segmentLabel: { fontFamily: fonts.sansMedium, fontSize: 14 },
  range: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  segmentRange: { fontFamily: fonts.mono, fontSize: 12, color: c.muted },
  segmentMonths: { fontFamily: fonts.monoMedium, fontSize: 13 },
  extend: {
    flexDirection: 'row',
    gap: 6,
    height: 44,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: c.line30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
