import {
  addListener,
  getPermissionsAsync,
  presentPermissionsPicker,
  requestPermissionsAsync,
} from 'expo-media-library';

import { ExpoPhotoLibrary } from '@/attachments/infrastructure/services/expo.photo-library';
import { ExpoPhotoLibrary as WebPhotoLibrary } from '@/attachments/infrastructure/services/expo.photo-library.web';

const mockQuery = {
  eq: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  exe: jest.fn(),
};
const mockAsset = { getFilename: jest.fn(), getUri: jest.fn() };
const mockFile = { type: '', size: 0 };

jest.mock('expo-media-library', () => ({
  addListener: jest.fn(),
  Asset: jest.fn(() => mockAsset),
  AssetField: { MEDIA_TYPE: 'mediaType', CREATION_TIME: 'creationTime' },
  MediaType: { IMAGE: 'image' },
  getPermissionsAsync: jest.fn(),
  presentPermissionsPicker: jest.fn(),
  Query: jest.fn(() => mockQuery),
  requestPermissionsAsync: jest.fn(),
}));
jest.mock('expo-file-system', () => ({ File: jest.fn(() => mockFile) }));

describe('ExpoPhotoLibrary', () => {
  const library = new ExpoPhotoLibrary();

  test.each([
    ['all', { granted: true, accessPrivileges: 'all' }],
    ['limited', { granted: true, accessPrivileges: 'limited' }],
    ['denied', { granted: false, canAskAgain: true }],
    ['blocked', { granted: false, canAskAgain: false }],
  ])('traduce el permiso a %s', async (access, response) => {
    jest.mocked(getPermissionsAsync).mockResolvedValue(response as never);
    jest.mocked(requestPermissionsAsync).mockResolvedValue(response as never);

    expect(await library.getAccess()).toBe(access);
    expect(await library.requestAccess()).toBe(access);
    expect(requestPermissionsAsync).toHaveBeenLastCalledWith(false, ['photo']);
  });

  test('lista solo imágenes, de más nueva a más antigua', async () => {
    mockQuery.exe.mockResolvedValue([{ id: 'ph://1' }]);

    expect(await library.findRecent(60, 120)).toEqual([{ id: 'ph://1', previewUri: 'ph://1' }]);
    expect(mockQuery.eq).toHaveBeenCalledWith('mediaType', 'image');
    expect(mockQuery.orderBy).toHaveBeenCalledWith({ key: 'creationTime', ascending: false });
    expect(mockQuery.limit).toHaveBeenCalledWith(60);
    expect(mockQuery.offset).toHaveBeenCalledWith(120);
  });

  test.each([
    ['image/heic', 'a.jpg', 'image/heic'],
    ['', 'a.JPG', 'image/jpeg'],
    ['', 'a.xyz', ''],
  ])('con tipo %j y nombre %s informa %j', async (type, fileName, mimeType) => {
    Object.assign(mockFile, { type, size: 5 });
    mockAsset.getFilename.mockResolvedValue(fileName);
    mockAsset.getUri.mockResolvedValue('file:///foto#datos');

    expect(await library.getPhoto('ph://1')).toEqual({
      uri: 'file:///foto',
      fileName,
      mimeType,
      sizeBytes: 5,
    });
  });

  test('en iOS espera al cambio de la biblioteca', async () => {
    const remove = jest.fn();
    jest.mocked(addListener).mockReturnValue({ remove } as never);
    let done = false;
    const choosing = library.chooseMore().then(() => (done = true));
    await Promise.resolve();
    expect(presentPermissionsPicker).toHaveBeenCalledWith(['photo']);
    expect(done).toBe(false);

    jest.mocked(addListener).mock.calls[0][0]({} as never);
    await choosing;
    expect(remove).toHaveBeenCalledTimes(1);
  });

  test('en web no está disponible', async () => {
    const web = new WebPhotoLibrary();
    expect(await web.getAccess()).toBe('unavailable');
    expect(await web.requestAccess()).toBe('unavailable');
    expect(await web.findRecent()).toEqual([]);
    await expect(web.getPhoto()).rejects.toThrow('La galería no está disponible en web.');
  });
});
