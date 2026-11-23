import { restoreSamplePurchases } from '@/products/presentation/services/restore-sample-purchases';
import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useRestoreSamplePurchases() {
  const useCases = useUseCases();
  return useAppMutation<void, void>(() => restoreSamplePurchases(useCases));
}
