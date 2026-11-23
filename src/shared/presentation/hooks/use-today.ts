import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useToday() {
  return useUseCases().clock.today();
}
