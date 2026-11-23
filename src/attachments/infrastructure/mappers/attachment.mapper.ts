// Mapper AttachmentMapper: convierte filas de SQLite en entidades Attachment y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import {
  Attachment,
  type AttachmentOwner,
  type AttachmentKind,
} from '@/attachments/domain/entities/attachment.entity';

// Fila de la tabla attachments. Es type y no interface para poder enviarse a upsertRow.
export type AttachmentRow = {
  id: string;
  owner_type: string;
  owner_id: string;
  kind: string;
  file_uri: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export class AttachmentMapper {
  static toDomain(row: AttachmentRow): Attachment {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Attachment.create({
      id: row.id,
      ownerType: row.owner_type as AttachmentOwner,
      ownerId: row.owner_id,
      kind: row.kind as AttachmentKind,
      fileUri: row.file_uri,
      fileName: row.file_name,
      mimeType: row.mime_type,
      sizeBytes: row.size_bytes,
      createdAt: row.created_at,
    });
  }

  static toRow(attachment: Attachment): AttachmentRow {
    return {
      id: attachment.id,
      owner_type: attachment.ownerType,
      owner_id: attachment.ownerId,
      kind: attachment.kind,
      file_uri: attachment.fileUri,
      file_name: attachment.fileName,
      mime_type: attachment.mimeType,
      size_bytes: attachment.sizeBytes,
      created_at: attachment.createdAt,
    };
  }
}
