import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import { Reminder } from '@/reminders/domain/entities/reminder.entity';
import { DeleteWarrantyUseCase } from '@/warranties/application/use-cases/delete-warranty.use-case';
import { Warranty } from '@/warranties/domain/entities/warranty.entity';

import {
  createSeededContext,
  entities,
  ids,
  missingId,
  notFoundError,
  testId,
  type TestContext,
} from '../../../shared/application/test-context';

describe('DeleteWarrantyUseCase', () => {
  let context: TestContext;
  let useCase: DeleteWarrantyUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new DeleteWarrantyUseCase({
      warrantyRepository: context.warranties,
      reminderRepository: context.reminders,
      claimRepository: context.claims,
      attachmentRepository: context.attachments,
    });
  });

  test('borra la garantía con sus recordatorios, reclamos y adjuntos', async () => {
    await context.attachments.save(
      Attachment.create({ ...entities.attachment, id: testId(8), ownerType: 'claim', ownerId: ids.claim }),
    );
    await context.attachments.save(
      Attachment.create({ ...entities.attachment, id: testId(9), ownerType: 'warranty', ownerId: ids.warranty }),
    );

    await useCase.execute(`  ${ids.warranty.toUpperCase()}  `);

    expect(await context.warranties.findAll()).toEqual([]);
    expect(await context.reminders.findAll()).toEqual([]);
    expect(await context.claims.findAll()).toEqual([]);
    expect(await context.attachments.findAll()).toEqual([entities.attachment]);
    expect(await context.products.findAll()).toEqual([entities.product]);
  });

  test('conserva los datos de otra garantía', async () => {
    const other = Warranty.restore({ ...entities.warranty, id: testId(40) });
    const reminder = Reminder.restore({ ...entities.reminder, id: testId(50), warrantyId: other.id });
    await context.warranties.save(other);
    await context.reminders.save(reminder);

    await useCase.execute(ids.warranty);

    expect(await context.warranties.findAll()).toEqual([other]);
    expect(await context.reminders.findAll()).toEqual([reminder]);
  });

  test('borra la garantía al final para poder reintentar si algo falla', async () => {
    jest.spyOn(context.claims, 'delete').mockRejectedValueOnce(new Error('Fallo'));

    await expect(useCase.execute(ids.warranty)).rejects.toThrow('Fallo');
    expect(await context.warranties.findById(ids.warranty)).toBe(entities.warranty);

    await useCase.execute(ids.warranty);
    expect(await context.warranties.findAll()).toEqual([]);
  });

  test('lanza NotFoundError si no existe', async () => {
    await expect(useCase.execute(missingId)).rejects.toThrow(notFoundError('Garantía no encontrada.'));
  });
});
