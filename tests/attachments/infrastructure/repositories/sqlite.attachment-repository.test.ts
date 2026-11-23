import type { SQLiteDatabase } from 'expo-sqlite';

import { Attachment } from '@/attachments/domain/entities/attachment.entity';
import { SqliteAttachmentRepository } from '@/attachments/infrastructure/repositories/sqlite.attachment-repository';

import { createTestDatabase } from '../../../shared/infrastructure/database/sqlite.test-database';

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

describe('SqliteAttachmentRepository', () => {
  let database: SQLiteDatabase;
  let repository: SqliteAttachmentRepository;

  beforeEach(async () => {
    database = await createTestDatabase();
    repository = new SqliteAttachmentRepository(database);
  });

  test('devuelve undefined si no existe', async () => {
    expect(await repository.findById(attachment.id)).toBeUndefined();
  });

  test('guarda y recupera por id', async () => {
    await repository.save(attachment);
    expect({ ...(await repository.findById(attachment.id)) }).toEqual({ ...attachment });
  });

  test('reemplaza si el id ya existe', async () => {
    await repository.save(attachment);
    await repository.save(Attachment.create({ ...attachment, fileName: 'nuevo.pdf' }));

    expect((await repository.findById(attachment.id))?.fileName).toBe('nuevo.pdf');
    expect(await database.getAllAsync('SELECT * FROM attachments')).toHaveLength(1);
  });

  test('borra solo el id indicado', async () => {
    const other = Attachment.create({ ...attachment, id: '00000032-0000-4000-8000-000000000000' });
    await repository.save(attachment);
    await repository.save(other);
    await repository.delete(attachment.id);

    expect(await repository.findById(attachment.id)).toBeUndefined();
    expect(await repository.findById(other.id)).toBeDefined();
  });

  test('findByOwner devuelve los resultados en orden', async () => {
    const first = Attachment.create({
      ...attachment,
      id: '00000032-0000-4000-8000-000000000000',
      createdAt: '2025-01-01',
    });
    await repository.save(attachment);
    await repository.save(first);

    const found = await repository.findByOwner('product', '00000003-0000-4000-8000-000000000000');
    expect(found.map(({ id }) => id)).toEqual([first.id, attachment.id]);
    expect(await repository.findByOwner('claim', '00000003-0000-4000-8000-000000000000')).toEqual(
      [],
    );
  });
});
