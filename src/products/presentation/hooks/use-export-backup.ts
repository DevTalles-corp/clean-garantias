import { usePurchases } from '@/products/presentation/hooks/use-purchases';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { showToast } from '@/shared/presentation/stores/toast.store';
import { saveTextFile } from '@/shared/presentation/utils/save-text-file';

export function useExportBackup() {
  const today = useToday();
  const { purchases = [] } = usePurchases();

  async function exportBackup() {
    const backup = {
      version: 1,
      exportedAt: today,
      purchases: purchases.map(({ product, storeName, categoryName, warranties }) => ({
        ...product,
        storeName,
        categoryName,
        warranties,
      })),
    };
    try {
      const saved = await saveTextFile(
        `garantias-respaldo-${today}.json`,
        JSON.stringify(backup, null, 2),
      );
      if (saved) showToast(`Respaldo exportado · ${purchases.length} compras`);
    } catch {
      showToast('No se pudo exportar el respaldo');
    }
  }

  return { exportBackup, total: purchases.length };
}
