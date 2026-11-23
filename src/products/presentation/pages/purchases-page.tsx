import { TextInput, View } from 'react-native';

import { useCategories } from '@/categories/presentation/hooks/use-categories';
import { FilterChips } from '@/products/presentation/components/filter-chips';
import { PurchaseRow } from '@/products/presentation/components/purchase-row';
import { usePurchases } from '@/products/presentation/hooks/use-purchases';
import { filterPurchases } from '@/products/presentation/models/purchase';
import { usePurchaseFiltersStore } from '@/products/presentation/stores/purchase-filters.store';
import { AppText } from '@/shared/presentation/components/app-text';
import { EmptyState } from '@/shared/presentation/components/empty-state';
import { Icon } from '@/shared/presentation/components/icon';
import { Screen } from '@/shared/presentation/components/screen';
import { ScreenTitle } from '@/shared/presentation/components/screen-title';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { SegmentedControl } from '@/shared/presentation/components/segmented-control';
import { TextButton } from '@/shared/presentation/components/text-button';
import { fonts } from '@/shared/presentation/constants/theme';
import { useTheme } from '@/shared/presentation/hooks/use-theme';
import { makeStyles } from '@/shared/presentation/utils/make-styles';
import { statusLabels } from '@/warranties/presentation/constants/status-labels';

const statusOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: statusLabels.active },
  { value: 'expiring', label: statusLabels.expiring },
  { value: 'expired', label: statusLabels.expired },
] as const;

export function PurchasesPage() {
  const colors = useTheme();
  const styles = useStyles();
  const { purchases, error } = usePurchases();
  const { data: categories = [] } = useCategories();
  const filters = usePurchaseFiltersStore();
  const { setFilters } = filters;

  const results = filterPurchases(purchases ?? [], filters);
  const storeNames = [...new Set(purchases?.map(({ storeName }) => storeName))].sort();
  const hasFilters = !!(filters.query || filters.category || filters.store || filters.status);

  return (
    <Screen gap={14}>
      <ScreenTitle>Compras</ScreenTitle>
      <View style={styles.search}>
        <Icon name="search" color={colors.muted} />
        <TextInput
          accessibilityLabel="Buscar"
          value={filters.query}
          onChangeText={(query) => setFilters({ query })}
          placeholder="Buscar producto o tienda"
          placeholderTextColor={colors.receiptMuted}
          style={styles.searchInput}
        />
      </View>
      <SegmentedControl
        options={statusOptions}
        value={filters.status ?? 'all'}
        onChange={(value) => setFilters({ status: value === 'all' ? null : value })}
      />
      <View style={{ gap: 8 }}>
        <SectionLabel>Categoría</SectionLabel>
        <FilterChips
          options={categories.map(({ name }) => name)}
          value={filters.category}
          onChange={(category) => setFilters({ category })}
        />
        <SectionLabel style={{ marginTop: 4 }}>Tienda</SectionLabel>
        <FilterChips options={storeNames} value={filters.store} onChange={(store) => setFilters({ store })} />
      </View>
      <View style={styles.results}>
        <AppText style={styles.count}>
          {results.length} {results.length === 1 ? 'compra' : 'compras'}
        </AppText>
        {hasFilters && (
          <TextButton
            label="Limpiar filtros"
            onPress={filters.clearFilters}
            style={{ paddingVertical: 4 }}
            textStyle={styles.clear}
          />
        )}
      </View>
      <View style={{ gap: 8 }}>
        {results.map((purchase) => (
          <PurchaseRow key={purchase.id} purchase={purchase} variant="card" />
        ))}
        {error && <EmptyState message={error} />}
        {purchases && results.length === 0 && (
          <EmptyState message="Ninguna compra coincide con estos filtros." />
        )}
      </View>
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.line10,
    borderRadius: 14,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    padding: 0,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: c.ink,
    outlineWidth: 0,
  },
  results: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  count: { fontSize: 13, color: c.muted },
  clear: { fontFamily: fonts.sansMedium, fontSize: 13, color: c.green },
}));
