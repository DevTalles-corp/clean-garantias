import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useScheduledReminders() {
  const { reminders } = useUseCases();
  return useQuery({
    queryKey: ['reminders', 'scheduled'],
    queryFn: () => reminders.findByStatus.execute('scheduled'),
  });
}
