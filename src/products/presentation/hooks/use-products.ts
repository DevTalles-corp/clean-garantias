import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useProducts() {
  const { products } = useUseCases();
  return useQuery({ queryKey: ['products'], queryFn: () => products.findAll.execute() });
}
