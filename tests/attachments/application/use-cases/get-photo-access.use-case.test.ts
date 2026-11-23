import { GetPhotoAccessUseCase } from '@/attachments/application/use-cases/get-photo-access.use-case';

import { createTestContext } from '../../../shared/application/test-context';

describe('GetPhotoAccessUseCase', () => {
  test('devuelve el permiso sin pedirlo', async () => {
    const { photoLibrary } = createTestContext();
    const request = jest.spyOn(photoLibrary, 'requestAccess');

    expect(await new GetPhotoAccessUseCase({ photoLibrary }).execute()).toBe('denied');
    expect(request).not.toHaveBeenCalled();
  });
});
