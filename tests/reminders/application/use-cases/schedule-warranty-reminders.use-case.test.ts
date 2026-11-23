import { ScheduleWarrantyRemindersUseCase } from '@/reminders/application/use-cases/schedule-warranty-reminders.use-case';
import { Reminder } from '@/reminders/domain/entities/reminder.entity';

import {
  createSeededContext,
  entities,
  createTestContext,
  firstGeneratedId,
  ids,
  missingId,
  notFoundError,
  today,
  type TestContext,
} from '../../../shared/application/test-context';

describe('ScheduleWarrantyRemindersUseCase', () => {
  let context: TestContext;
  let useCase: ScheduleWarrantyRemindersUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new ScheduleWarrantyRemindersUseCase(
      context.reminders,
      context.warranties,
      context.settings,
      context.idGenerator,
      context.clock,
    );
  });

  test('normaliza el id, conserva el vigente y crea el que falta', async () => {
    const reminders = await useCase.execute(`  ${ids.warranty.toUpperCase()}  `);

    expect(reminders).toHaveLength(2);
    expect(reminders[0]).toBe(entities.reminder);
    expect(reminders[1]).toMatchObject({
      id: firstGeneratedId,
      offsetDays: 7,
      fireAt: '2027-01-03',
      createdAt: today,
    });
  });

  test('no duplica al ejecutarse de nuevo', async () => {
    await useCase.execute(ids.warranty);
    await useCase.execute(ids.warranty);

    expect(await context.reminders.findAll()).toHaveLength(2);
  });

  test('ignora días repetidos en la configuración', async () => {
    await context.settings.save(entities.settings.update({ reminderOffsetsDays: [7, 7] }));

    expect(await useCase.execute(ids.warranty)).toHaveLength(1);
  });

  test('cancela los que apuntan a otro vencimiento', async () => {
    await context.warranties.save(entities.warranty.update({ durationMonths: 24 }, '2026-01-10', today));

    const reminders = await useCase.execute(ids.warranty);

    expect(reminders.map(({ fireAt }) => fireAt)).toEqual(['2027-12-11', '2028-01-03']);
    expect((await context.reminders.findById(ids.reminder))?.status).toBe('cancelled');
  });

  test('no repite un aviso ya enviado', async () => {
    await context.reminders.save(entities.reminder.markAsSent());

    const reminders = await useCase.execute(ids.warranty);

    expect(reminders.map(({ offsetDays }) => offsetDays)).toEqual([7]);
  });

  test('omite los avisos pasados y no cancela uno programado que ya venció', async () => {
    // Vence el 2026-07-10: el aviso de 30 días era el 2026-06-10.
    await context.warranties.save(entities.warranty.update({ durationMonths: 6 }, '2026-01-10', today));
    const past = Reminder.restore({ ...entities.reminder, fireAt: '2026-06-10' });
    await context.reminders.save(past);

    await useCase.execute(ids.warranty);

    expect(await context.reminders.findById(ids.reminder)).toBe(past);
    expect((await context.reminders.findAll()).map(({ fireAt }) => fireAt)).toEqual([
      '2026-06-10',
      '2026-07-03',
    ]);
  });

  test('cancela todos si las notificaciones están apagadas', async () => {
    await context.settings.save(entities.settings.update({ notificationsEnabled: false }));

    expect(await useCase.execute(ids.warranty)).toEqual([]);
    expect((await context.reminders.findById(ids.reminder))?.status).toBe('cancelled');
  });

  test('cancela todos si la garantía está archivada', async () => {
    await context.warranties.save(entities.warranty.setArchived(true, today));

    expect(await useCase.execute(ids.warranty)).toEqual([]);
  });

  test('no programa nada si aún no hay configuración', async () => {
    const empty = createTestContext();
    await empty.warranties.save(entities.warranty);

    expect(await empty.scheduleWarrantyReminders.execute(ids.warranty)).toEqual([]);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Garantía no encontrada.'));
  });
});
