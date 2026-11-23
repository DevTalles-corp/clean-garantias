import { AssignReminderNotificationUseCase } from '@/reminders/application/use-cases/assign-reminder-notification.use-case';

import {
  conflictError,
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('AssignReminderNotificationUseCase', () => {
  let context: TestContext;
  let useCase: AssignReminderNotificationUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new AssignReminderNotificationUseCase({
      reminderRepository: context.reminders,
    });
  });

  test('actualiza y guarda el recordatorio', async () => {
    const reminder = await useCase.execute(`  ${ids.reminder.toUpperCase()}  `, 'notif-1');

    expect(reminder).toMatchObject({ status: 'scheduled', notificationId: 'notif-1' });
    expect(await context.reminders.findById(ids.reminder)).toBe(reminder);
  });

  test('lanza ConflictError y no guarda si ya no está programado', async () => {
    await context.reminders.save(entities.reminder.cancel());
    const save = jest.spyOn(context.reminders, 'save');

    await expect(useCase.execute(ids.reminder, 'notif-1')).rejects.toThrow(
      conflictError('Solo se puede modificar un recordatorio programado.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId, 'notif-1')).rejects.toThrow(notFoundError('Recordatorio no encontrado.'));
  });
});
