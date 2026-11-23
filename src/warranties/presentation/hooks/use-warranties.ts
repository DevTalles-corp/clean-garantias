import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useWarranties() {
  const { warranties } = useUseCases();
  return useQuery({ queryKey: ['warranties'], queryFn: () => warranties.findAll.execute() });
}
