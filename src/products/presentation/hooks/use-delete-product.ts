import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useDeleteProduct() {
  const { products } = useUseCases();
  return useAppMutation((id: string) => products.delete.execute(id));
}
