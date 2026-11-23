import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useStores() {
  const { stores } = useUseCases();
  return useQuery({ queryKey: ['stores'], queryFn: () => stores.findAll.execute() });
}
