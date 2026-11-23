import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import { ReminderMapper } from '@/reminders/infrastructure/mappers/reminder.mapper';

const reminder = Reminder.restore({
  id: '00000005-0000-4000-8000-000000000000',
  warrantyId: '00000004-0000-4000-8000-000000000000',
  offsetDays: 7,
  fireAt: '2028-01-03',
  notificationId: 'n-1',
  status: 'sent',
  createdAt: '2026-01-15',
});

describe('ReminderMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = ReminderMapper.toDomain(ReminderMapper.toRow(reminder));

    expect(restored).toBeInstanceOf(Reminder);
    expect({ ...restored }).toEqual({ ...reminder });
  });

  test('convierte los opcionales ausentes en null y de vuelta', () => {
    const minimal = Reminder.restore({
      ...reminder,
      notificationId: undefined,
    });
    const row = ReminderMapper.toRow(minimal);

    expect(Object.values(row)).not.toContain(undefined);
    expect(Object.values(row)).toContain(null);
    expect({ ...ReminderMapper.toDomain(row) }).toEqual({ ...minimal });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() =>
      ReminderMapper.toDomain({ ...ReminderMapper.toRow(reminder), status: 'x' }),
    ).toThrow(expect.objectContaining({ name: 'ValidationError' }));
  });
});
