import { registerPurchase, type RegisterPurchaseInput } from '@/products/presentation/services/register-purchase';
import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useRegisterPurchase() {
  const useCases = useUseCases();
  return useAppMutation((input: RegisterPurchaseInput) => registerPurchase(useCases, input));
}
