import {
  Attachment,
  attachmentKinds,
  attachmentOwners,
  maxAttachmentBytes,
  type CreateAttachmentProps,
} from '@/attachments/domain/entities/attachment.entity';

const id = '3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';
const ownerId = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';

const validProps: CreateAttachmentProps = {
  id,
  ownerType: 'product',
  ownerId,
  kind: 'receipt',
  fileUri: 'file:///recibo.pdf',
  fileName: 'recibo.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 1024,
  createdAt: '2026-01-15',
};

const validationError = (message: string) =>
  expect.objectContaining({ name: 'ValidationError', message });

describe('Attachment Entity', () => {
  test('crea un adjunto con sus datos normalizados', () => {
    const attachment = Attachment.create({
      ...validProps,
      id: `  ${id.toUpperCase()}  `,
      ownerId: `  ${ownerId.toUpperCase()}  `,
      fileUri: '  file:///recibo.pdf  ',
      fileName: '  recibo.pdf  ',
      mimeType: '  APPLICATION/PDF  ',
    });

    expect(attachment).toBeInstanceOf(Attachment);
    expect({ ...attachment }).toEqual(validProps);
  });

  test.each(attachmentOwners)('admite el dueño %s', (ownerType) => {
    expect(Attachment.create({ ...validProps, ownerType }).ownerType).toBe(ownerType);
  });

  test.each(attachmentKinds)('admite el tipo %s', (kind) => {
    expect(Attachment.create({ ...validProps, kind }).kind).toBe(kind);
  });

  test.each(['image/png', 'image/jpeg', 'image/svg+xml', 'image/vnd.ms-photo', 'application/pdf'])(
    'admite el formato %s',
    (mimeType) => {
      expect(Attachment.create({ ...validProps, mimeType }).mimeType).toBe(mimeType);
    },
  );

  test.each(['', 'image/', 'image/+xml', 'text/plain', 'video/mp4', 'application/pdfx', 'x-image/png'])(
    'rechaza el formato %j',
    (mimeType) => {
      expect(() => Attachment.create({ ...validProps, mimeType })).toThrow(
        validationError('El archivo debe ser una imagen o un PDF.'),
      );
    },
  );

  test('fija el tamaño máximo en 10 MB', () => {
    expect(maxAttachmentBytes).toBe(10_485_760);
  });

  test.each([0, 1, 10_485_760])('admite un archivo de %d bytes', (sizeBytes) => {
    expect(Attachment.create({ ...validProps, sizeBytes }).sizeBytes).toBe(sizeBytes);
  });

  test('rechaza un archivo que supera los 10 MB', () => {
    expect(() => Attachment.create({ ...validProps, sizeBytes: 10_485_761 })).toThrow(
      validationError('El archivo no puede superar los 10 MB.'),
    );
  });

  test.each([-1, 1.5, NaN, Infinity])('rechaza el tamaño inválido %d', (sizeBytes) => {
    expect(() => Attachment.create({ ...validProps, sizeBytes })).toThrow(
      validationError('El tamaño debe ser un entero mayor o igual a cero.'),
    );
  });

  test.each([
    ['id', 'abc', 'El id debe ser un UUID válido.'],
    ['id', '', 'El id debe ser un UUID válido.'],
    ['ownerId', 'abc', 'El dueño debe ser un UUID válido.'],
    ['ownerType', 'store', 'El tipo de dueño no es válido.'],
    ['kind', 'video', 'El tipo de adjunto no es válido.'],
    ['fileUri', '   ', 'La ubicación del archivo es obligatoria.'],
    ['fileName', '\t\n', 'El nombre del archivo es obligatorio.'],
    ['createdAt', '2026-02-30', 'La fecha de creación no es válida.'],
  ])('rechaza %s con el valor %j', (field, value, message) => {
    expect(() => Attachment.create({ ...validProps, [field]: value })).toThrow(validationError(message));
  });

  test('impide modificar sus datos en ejecución', () => {
    const attachment = Attachment.create(validProps);

    expect(Reflect.set(attachment, 'fileName', 'otro.pdf')).toBe(false);
    expect(attachment.fileName).toBe('recibo.pdf');
  });

  test('normaliza un id', () => {
    expect(Attachment.normalizeId(`  ${id.toUpperCase()}  `)).toBe(id);
  });
});
