import { View } from 'react-native';

import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import { useToggleReminder } from '@/reminders/presentation/hooks/use-toggle-reminder';
import { useWarrantyReminders } from '@/reminders/presentation/hooks/use-warranty-reminders';
import { useSettings } from '@/settings/presentation/hooks/use-settings';
import { reminderOffsets } from '@/reminders/presentation/constants/reminder-offsets';
import { Card } from '@/shared/presentation/components/card';
import { SectionLabel } from '@/shared/presentation/components/section-label';
import { SwitchRow } from '@/shared/presentation/components/switch-row';
import { formatDate } from '@/shared/presentation/formatters/format-date';
import { useToday } from '@/shared/presentation/hooks/use-today';
import { showToast } from '@/shared/presentation/stores/toast.store';
import type { Warranty } from '@/warranties/domain/entities/warranty.entity';

export function WarrantyRemindersCard({ warranty }: { warranty: Warranty }) {
  const today = useToday();
  const { data: reminders = [] } = useWarrantyReminders(warranty.id);
  const { data: settings } = useSettings();
  const toggle = useToggleReminder(warranty.id);

  return (
    <View style={{ gap: 10 }}>
      <SectionLabel>Avisos antes del vencimiento</SectionLabel>
      <Card>
        {reminderOffsets.map((offsetDays) => {
          const fireAt = Reminder.calculateFireAt(warranty.endDate, offsetDays);
          const date = formatDate(fireAt);
          const isPast = fireAt < today;
          const current = reminders.find(
            (reminder) =>
              reminder.status === 'scheduled' &&
              reminder.offsetDays === offsetDays &&
              reminder.fireAt === fireAt,
          );
          const isOn = !!current && !isPast;

          function press() {
            if (toggle.isPending) return;
            if (isPast) return showToast('Esa fecha ya pasó', 'info');
            if (!isOn && !settings?.reminderOffsetsDays.includes(offsetDays)) {
              return showToast(`Activa el aviso de ${offsetDays} días en Ajustes`, 'info');
            }
            toggle.mutate(
              { offsetDays, current },
              {
                onSuccess: (reminder) =>
                  reminder
                    ? showToast(`Aviso programado · ${date}`)
                    : showToast('Aviso cancelado', 'info'),
              },
            );
          }

          return (
            <SwitchRow
              key={offsetDays}
              monoDetail
              icon="bell"
              label={`${offsetDays} días antes`}
              detail={isPast ? `Fecha pasada · ${date}` : isOn ? `Programado para el ${date}` : 'Desactivado'}
              value={isOn}
              onPress={press}
            />
          );
        })}
      </Card>
    </View>
  );
}
