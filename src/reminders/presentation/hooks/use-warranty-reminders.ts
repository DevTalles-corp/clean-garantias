import { useQuery } from '@tanstack/react-query';

import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

export function useWarrantyReminders(warrantyId: string) {
  const { reminders } = useUseCases();
  return useQuery({
    queryKey: ['reminders', 'warranty', warrantyId],
    queryFn: () => reminders.findByWarranty.execute(warrantyId),
  });
}
