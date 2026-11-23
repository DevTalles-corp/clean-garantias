import { attachSimulatedReceipt } from '@/products/presentation/services/register-purchase';
import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useAttachReceipt(productId: string) {
  const useCases = useUseCases();
  return useAppMutation<void, void>(() => attachSimulatedReceipt(useCases, productId));
}
