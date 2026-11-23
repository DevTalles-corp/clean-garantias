import { GetAttachmentUriUseCase } from '@/attachments/application/use-cases/get-attachment-uri.use-case';

import { createTestContext } from '../../../shared/application/test-context';

describe('GetAttachmentUriUseCase', () => {
  const { attachmentStorage } = createTestContext();
  const useCase = new GetAttachmentUriUseCase({ attachmentStorage });

  test('devuelve la ubicación de un archivo guardado', async () => {
    const fileUri = await attachmentStorage.save('file:///foto.jpg', 'foto.jpg');
    expect(useCase.execute(fileUri)).toBe('file:///documents/receipts/foto.jpg');
  });

  test.each(['simulated://recibo.jpg', 'receipts/otro.jpg'])('devuelve null con %s', (fileUri) => {
    expect(useCase.execute(fileUri)).toBeNull();
  });
});
