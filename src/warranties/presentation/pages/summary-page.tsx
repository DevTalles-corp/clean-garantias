import { router } from 'expo-router';
import { View } from 'react-native';

import { PurchaseRow } from '@/products/presentation/components/purchase-row';
import { usePurchases } from '@/products/presentation/hooks/use-purchases';
import { findUpcoming, summarizePurchases } from '@/products/presentation/models/purchase';
import { usePurchaseFiltersStore } from '@/products/presentation/stores/purchase-filters.store';
import { useScheduledReminders } from '@/reminders/presentation/hooks/use-scheduled-reminders';
import { useSettings } from '@/settings/presentation/hooks/use-settings';
import { daysBetween } from '@/shared/domain/value-objects/iso-date';
import { AppText } from '@/shared/presentation/components/app-text';
import { Card } from '@/shared/presentation/components/card';
import { EmptyState } from '@/shared/presentation/components/empty-state';
import { Screen } from '@/shared/presentation/components/screen';
import { ScreenTitle } from '@/shared/presentation/components/screen-title';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { TextButton } from '@/shared/presentation/components/text-button';
import { fonts } from '@/shared/presentation/constants/theme';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { ProtectedMoneyCard } from '@/warranties/presentation/components/protected-money-card';
import { SummaryStatCard } from '@/warranties/presentation/components/summary-stat-card';

export function SummaryPage() {
  const colors = useTheme();
  const today = useToday();
  const { purchases, error } = usePurchases();
  const { data: settings } = useSettings();
  const { data: reminders = [] } = useScheduledReminders();
  const setFilters = usePurchaseFiltersStore((state) => state.setFilters);

  const upcoming = findUpcoming(purchases ?? []);
  const summary =
    purchases && settings && summarizePurchases(purchases, today, settings.currency);
  const nextReminders = reminders.filter(({ fireAt }) => {
    const days = daysBetween(today, fireAt);
    return days >= 0 && days <= 30;
  });

  return (
    <Screen gap={18}>
      <View style={{ gap: 2 }}>
        <SectionLabel size={12}>{formatDate(today)}</SectionLabel>
        <ScreenTitle>Tus garantías</ScreenTitle>
      </View>
      {error && <EmptyState message={error} />}
      {summary && (
        <>
          <ProtectedMoneyCard summary={summary} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <SummaryStatCard highlighted icon="calendar" value={summary.expiringThisMonth} label="vencen este mes" />
            <SummaryStatCard icon="bell" value={nextReminders.length} label="avisos en los próximos 30 días" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText style={{ fontFamily: fonts.displaySemi, fontSize: 19 }}>Próximos vencimientos</AppText>
            <TextButton
              label="Ver todas"
              icon="forward"
              iconPosition="end"
              onPress={() => {
                setFilters({ status: null });
                router.navigate('/products');
              }}
              style={{ paddingVertical: 6 }}
              textStyle={{ fontFamily: fonts.sansMedium, fontSize: 14, color: colors.green }}
            />
          </View>
          {upcoming.length > 0 ? (
            <Card style={{ overflow: 'hidden' }}>
              {upcoming.map((purchase) => (
                <PurchaseRow key={purchase.id} purchase={purchase} variant="list" />
              ))}
            </Card>
          ) : (
            <EmptyState message="No hay garantías por vencer." />
          )}
        </>
      )}
    </Screen>
  );
}
