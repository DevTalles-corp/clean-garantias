import { FindRemindersByStatusUseCase } from '@/reminders/application/use-cases/find-reminders-by-status.use-case';

import {
  createSeededContext,
  entities,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindRemindersByStatusUseCase', () => {
  let context: TestContext;
  let useCase: FindRemindersByStatusUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindRemindersByStatusUseCase({
      reminderRepository: context.reminders,
    });
  });

  test('devuelve solo los recordatorios con ese estado', async () => {
    expect(await useCase.execute('scheduled')).toEqual([entities.reminder]);
    expect(await useCase.execute('sent')).toEqual([]);
  });
});
