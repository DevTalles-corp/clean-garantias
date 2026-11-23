import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import { AttachmentMapper } from '@/attachments/infrastructure/mappers/attachment.mapper';

const attachment = Attachment.create({
  id: '00000007-0000-4000-8000-000000000000',
  ownerType: 'product',
  ownerId: '00000003-0000-4000-8000-000000000000',
  kind: 'receipt',
  fileUri: 'file:///r.pdf',
  fileName: 'r.pdf',
  mimeType: 'application/pdf',
  sizeBytes: 0,
  createdAt: '2026-01-15',
});

describe('AttachmentMapper', () => {
  test('conserva todos los datos al convertir a fila y de vuelta', () => {
    const restored = AttachmentMapper.toDomain(AttachmentMapper.toRow(attachment));

    expect(restored).toBeInstanceOf(Attachment);
    expect({ ...restored }).toEqual({ ...attachment });
  });

  test('rechaza una fila con datos inválidos', () => {
    expect(() =>
      AttachmentMapper.toDomain({ ...AttachmentMapper.toRow(attachment), owner_type: 'x' }),
    ).toThrow(expect.objectContaining({ name: 'ValidationError' }));
  });
});
