import { ExpoAttachmentStorage } from '@/attachments/infrastructure/services/expo.attachment-storage';
import { ExpoAttachmentStorage as WebAttachmentStorage } from '@/attachments/infrastructure/services/expo.attachment-storage.web';

const mockFiles = new Set<string>();
let mockCopyError: Error | null = null;

jest.mock('expo-file-system', () => {
  class MockFile {
    readonly uri: string;
    constructor(...parts: string[]) {
      this.uri = parts.join('/');
    }
    get exists() {
      return mockFiles.has(this.uri);
    }
    async copy(target: MockFile) {
      mockFiles.add(target.uri);
      if (mockCopyError) throw mockCopyError;
    }
    delete() {
      mockFiles.delete(this.uri);
    }
  }
  return {
    File: MockFile,
    Directory: jest.fn(() => ({ create: jest.fn() })),
    Paths: { document: 'file:///documents' },
  };
});

const idGenerator = { generate: () => 'id-1' };

describe('ExpoAttachmentStorage', () => {
  const storage = new ExpoAttachmentStorage(idGenerator);

  beforeEach(() => {
    mockFiles.clear();
    mockCopyError = null;
  });

  test.each([
    ['IMG_1.HEIC', 'receipts/id-1.heic'],
    ['foto', 'receipts/id-1.jpg'],
  ])('guarda %s en la ruta relativa %s', async (fileName, fileUri) => {
    expect(await storage.save('file:///origen', fileName)).toBe(fileUri);
    expect(storage.resolveUri(fileUri)).toBe(`file:///documents/${fileUri}`);
  });

  test('borra la copia a medias si falla', async () => {
    mockCopyError = new Error('sin espacio');
    await expect(storage.save('file:///origen', 'a.jpg')).rejects.toThrow('sin espacio');
    expect(mockFiles.size).toBe(0);
  });

  test('borra un archivo propio', async () => {
    await storage.save('file:///origen', 'a.jpg');
    await storage.delete('receipts/id-1.jpg');
    expect(storage.resolveUri('receipts/id-1.jpg')).toBeNull();
  });

  test.each(['simulated://recibo.jpg', 'file:///a.jpg', 'receipts/../a.jpg', 'receipts/otro.jpg'])(
    'ignora la ruta ajena o inexistente %s',
    async (fileUri) => {
      mockFiles.add('file:///documents/a.jpg');
      await storage.delete(fileUri);
      expect(storage.resolveUri(fileUri)).toBeNull();
      expect(mockFiles.size).toBe(1);
    },
  );

  test('en web no guarda archivos', async () => {
    const web = new WebAttachmentStorage();
    await expect(web.save()).rejects.toThrow('Guardar archivos no está disponible en web.');
    expect(web.resolveUri()).toBeNull();
  });
});
