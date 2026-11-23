// Implementación ExpoPhotoLibrary: consulta las fotos del dispositivo con expo-media-library.
// Cumple el contrato PhotoLibrary.

import { File } from 'expo-file-system';
import {
  addListener,
  Asset,
  AssetField,
  getPermissionsAsync,
  MediaType,
  presentPermissionsPicker,
  Query,
  requestPermissionsAsync,
  type PermissionResponse,
} from 'expo-media-library';
import { Platform } from 'react-native';

import type {
  LibraryPhoto,
  PhotoAccess,
  PhotoLibrary,
  PickedPhoto,
} from '@/attachments/domain/services/photo-library';

const mimeTypes: Record<string, string> = {
  avif: 'image/avif',
  bmp: 'image/bmp',
  gif: 'image/gif',
  heic: 'image/heic',
  heif: 'image/heif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export class ExpoPhotoLibrary implements PhotoLibrary {
  private finishChoosing?: () => void;

  async getAccess(): Promise<PhotoAccess> {
    return toAccess(await getPermissionsAsync(false, ['photo']));
  }

  async requestAccess(): Promise<PhotoAccess> {
    return toAccess(await requestPermissionsAsync(false, ['photo']));
  }

  async chooseMore(): Promise<void> {
    if (Platform.OS !== 'ios') return presentPermissionsPicker(['photo']);

    // En iOS la promesa no espera al cierre: el fin lo marca el cambio en la biblioteca.
    // Si no se cambia nada no hay aviso, y el intento anterior se cierra con el siguiente.
    this.finishChoosing?.();
    const changed = new Promise<void>((resolve) => {
      const subscription = addListener(() => this.finishChoosing?.());
      this.finishChoosing = () => {
        this.finishChoosing = undefined;
        subscription.remove();
        resolve();
      };
    });
    try {
      await presentPermissionsPicker(['photo']);
    } catch (error) {
      this.finishChoosing?.();
      throw error;
    }
    await changed;
  }

  async findRecent(limit: number, offset: number): Promise<LibraryPhoto[]> {
    const assets = await new Query()
      .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
      .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
      .limit(limit)
      .offset(offset)
      .exe();
    return assets.map(({ id }) => ({ id, previewUri: id }));
  }

  async getPhoto(id: string): Promise<PickedPhoto> {
    const asset = new Asset(id);
    const fileName = await asset.getFilename();
    // En Android el id es content://, legible también con acceso limitado.
    const uri = Platform.OS === 'ios' ? (await asset.getUri()).split('#')[0] : id;
    const file = new File(uri);
    const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
    return {
      uri,
      fileName,
      mimeType: file.type || (mimeTypes[extension] ?? ''),
      sizeBytes: file.size,
    };
  }
}

function toAccess({ granted, canAskAgain, accessPrivileges }: PermissionResponse): PhotoAccess {
  if (granted) return accessPrivileges === 'limited' ? 'limited' : 'all';
  return canAskAgain ? 'denied' : 'blocked';
}
