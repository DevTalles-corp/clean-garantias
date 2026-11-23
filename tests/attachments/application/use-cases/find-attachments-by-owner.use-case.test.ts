import { FindAttachmentsByOwnerUseCase } from '@/attachments/application/use-cases/find-attachments-by-owner.use-case';

import {
  createSeededContext,
  entities,
  ids,
  type TestContext,
} from '../../../shared/application/test-context';

describe('FindAttachmentsByOwnerUseCase', () => {
  let context: TestContext;
  let useCase: FindAttachmentsByOwnerUseCase;

  beforeEach(async () => {
    context = await createSeededContext();
    useCase = new FindAttachmentsByOwnerUseCase({
      attachmentRepository: context.attachments,
    });
  });

  test('normaliza el id y devuelve los adjuntos del dueño', async () => {
    expect(await useCase.execute('product', `  ${ids.product.toUpperCase()}  `)).toEqual([entities.attachment]);
  });

  test('distingue el tipo de dueño', async () => {
    expect(await useCase.execute('claim', ids.product)).toEqual([]);
  });
});
