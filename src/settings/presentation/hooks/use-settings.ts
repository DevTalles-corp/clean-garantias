import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useSettings() {
  const { settings } = useUseCases();
  return useQuery({ queryKey: ['settings'], queryFn: () => settings.find.execute() });
}
