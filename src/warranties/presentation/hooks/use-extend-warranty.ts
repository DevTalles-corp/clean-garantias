import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';
import type { CreateWarrantyData } from '@/warranties/domain/entities/warranty.entity';

export function useExtendWarranty(productId: string) {
  const { warranties } = useUseCases();
  return useAppMutation((input: CreateWarrantyData) => warranties.create.execute(productId, input));
}
