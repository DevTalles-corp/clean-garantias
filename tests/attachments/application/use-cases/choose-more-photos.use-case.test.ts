import { ChooseMorePhotosUseCase } from '@/attachments/application/use-cases/choose-more-photos.use-case';

import { createTestContext } from '../../../shared/application/test-context';

describe('ChooseMorePhotosUseCase', () => {
  test('abre el selector', async () => {
    const { photoLibrary } = createTestContext();
    const chooseMore = jest.spyOn(photoLibrary, 'chooseMore');

    await new ChooseMorePhotosUseCase({ photoLibrary }).execute();
    expect(chooseMore).toHaveBeenCalledTimes(1);
  });
});
