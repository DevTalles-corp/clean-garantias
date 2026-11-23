import { MarkReminderAsSentUseCase } from '@/reminders/application/use-cases/mark-reminder-as-sent.use-case';

import {
  conflictError,
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  type TestContext,
} from '../../../shared/application/test-context';

describe('MarkReminderAsSentUseCase', () => {
  let context: TestContext;
  let useCase: MarkReminderAsSentUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new MarkReminderAsSentUseCase({
      reminderRepository: context.reminders,
    });
  });

  test('actualiza y guarda el recordatorio', async () => {
    const reminder = await useCase.execute(`  ${ids.reminder.toUpperCase()}  `);

    expect(reminder).toMatchObject({ status: 'sent' });
    expect(await context.reminders.findById(ids.reminder)).toBe(reminder);
  });

  test('lanza ConflictError y no guarda si ya no está programado', async () => {
    await context.reminders.save(entities.reminder.cancel());
    const save = jest.spyOn(context.reminders, 'save');

    await expect(useCase.execute(ids.reminder)).rejects.toThrow(
      conflictError('Solo se puede modificar un recordatorio programado.'),
    );
    expect(save).not.toHaveBeenCalled();
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Recordatorio no encontrado.'));
  });
});
