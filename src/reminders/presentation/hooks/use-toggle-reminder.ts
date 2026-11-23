import type { Reminder } from '@/reminders/domain/entities/reminder.entity';
import { useAppMutation } from '@/shared/presentation/hooks/use-app-mutation';
import { useUseCases } from '@/shared/presentation/providers/use-cases.context';

interface ToggleReminderInput {
  offsetDays: number;
  current?: Reminder; // programado: se cancela
}

// Devuelve el aviso programado, o undefined si quedó cancelado.
export function useToggleReminder(warrantyId: string) {
  const { reminders } = useUseCases();

  return useAppMutation(async ({ offsetDays, current }: ToggleReminderInput) => {
    if (current) {
      await reminders.cancel.execute(current.id);
      return undefined;
    }

    // Programar recrea todos los avisos configurados: se vuelven a cancelar los que estaban apagados.
    const isScheduled = ({ status }: Reminder) => status === 'scheduled';
    const before = (await reminders.findByWarranty.execute(warrantyId)).filter(isScheduled);
    const scheduled = await reminders.schedule.execute(warrantyId);
    for (const reminder of scheduled) {
      const wasActive = before.some(({ id }) => id === reminder.id);
      if (!wasActive && reminder.offsetDays !== offsetDays) await reminders.cancel.execute(reminder.id);
    }
    return scheduled.find((reminder) => reminder.offsetDays === offsetDays);
  });
}
