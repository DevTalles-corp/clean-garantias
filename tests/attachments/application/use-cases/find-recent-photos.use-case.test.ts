import { FindRecentPhotosUseCase } from '@/attachments/application/use-cases/find-recent-photos.use-case';

import { createTestContext } from '../../../shared/application/test-context';

describe('FindRecentPhotosUseCase', () => {
  test('devuelve la página pedida', async () => {
    const { photoLibrary } = createTestContext();
    photoLibrary.photos = ['1', '2', '3'].map((id) => ({ id, previewUri: id }));

    const photos = await new FindRecentPhotosUseCase({ photoLibrary }).execute(2, 2);
    expect(photos).toEqual([{ id: '3', previewUri: '3' }]);
  });
});
