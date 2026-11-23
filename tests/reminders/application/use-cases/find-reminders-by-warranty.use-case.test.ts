import { FindRemindersByWarrantyUseCase } from '@/reminders/application/use-cases/find-reminders-by-warranty.use-case';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindRemindersByWarrantyUseCase', () => {
  let context: TestContext;
  let useCase: FindRemindersByWarrantyUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindRemindersByWarrantyUseCase({
      reminderRepository: context.reminders,
    });
  });

  test('normaliza el id y devuelve los registros relacionados', async () => {
    expect(await useCase.execute(`  ${ids.warranty.toUpperCase()}  `)).toEqual([entities.reminder]);
  });

  test('devuelve una lista vacía si no hay registros relacionados', async () => {
    expect(await useCase.execute(missingId)).toEqual([]);
  });
});
