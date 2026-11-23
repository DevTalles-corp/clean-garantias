import { useCategories } from '@/categories/presentation/hooks/use-categories';
import { useProducts } from '@/products/presentation/hooks/use-products';
import { buildPurchases, type Purchase } from '@/products/presentation/models/purchase';
import { useSettings } from '@/settings/presentation/hooks/use-settings';
import { toErrorMessage } from '@/shared/presentation/errors/error-messages';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { useStores } from '@/stores/presentation/hooks/use-stores';
import { useWarranties } from '@/warranties/presentation/hooks/use-warranties';

// undefined mientras carga; así no se confunde con una lista vacía.
export function usePurchases(): { purchases: Purchase[] | undefined; error: string | null } {
  const today = useToday();
  const products = useProducts();
  const warranties = useWarranties();
  const categories = useCategories();
  const stores = useStores();
  const settings = useSettings();

  const error =
    products.error ?? warranties.error ?? categories.error ?? stores.error ?? settings.error;
  if (error) return { purchases: undefined, error: toErrorMessage(error) };

  const isReady =
    products.data && warranties.data && categories.data && stores.data && settings.data;
  return {
    error: null,
    purchases: isReady
      ? buildPurchases({
          products: products.data,
          warranties: warranties.data,
          categories: categories.data,
          stores: stores.data,
          thresholdDays: settings.data.expiringThresholdDays,
          today,
        })
      : undefined,
  };
}
