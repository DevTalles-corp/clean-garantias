import { RequestPhotoAccessUseCase } from '@/attachments/application/use-cases/request-photo-access.use-case';

import { createTestContext } from '../../../shared/application/test-context';

describe('RequestPhotoAccessUseCase', () => {
  test('pide el permiso y devuelve el resultado', async () => {
    const { photoLibrary } = createTestContext();
    photoLibrary.accessAfterRequest = 'limited';

    expect(await new RequestPhotoAccessUseCase({ photoLibrary }).execute()).toBe('limited');
  });
});
