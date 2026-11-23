// Entidad del dominio Attachment: archivo asociado a un producto, garantía o reclamo.
// Limita dueño, formato y tamaño; sin ella, se podrían guardar archivos no admitidos.

// El constructor privado dirige la creación a create() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { ValidationError } from '@/shared/domain/errors/domain.errors';
import {
  requireIsoDate,
  requireNonNegativeInteger,
  requireOneOf,
  requireText,
  requireUuid,
} from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export const attachmentOwners = ['product', 'warranty', 'claim'] as const;
export type AttachmentOwner = (typeof attachmentOwners)[number];

export const attachmentKinds = [
  'receipt',
  'invoice',
  'warranty_card',
  'manual',
  'photo',
  'other',
] as const;
export type AttachmentKind = (typeof attachmentKinds)[number];

export const maxAttachmentBytes = 10 * 1024 * 1024; // 10 MB
const mimeTypePattern = /^(?:image\/[a-z0-9][a-z0-9.+-]*|application\/pdf)$/;

export interface CreateAttachmentData {
  ownerType: AttachmentOwner;
  ownerId: string;
  kind: AttachmentKind;
  fileUri: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface CreateAttachmentProps extends CreateAttachmentData {
  id: string;
  createdAt: IsoDate;
}

export class Attachment {
  readonly id: string; // UUID
  readonly ownerType: AttachmentOwner;
  readonly ownerId: string; // id del Product, Warranty o Claim según ownerType
  readonly kind: AttachmentKind;
  readonly fileUri: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly createdAt: IsoDate;

  private constructor(attachment: CreateAttachmentProps) {
    this.id = attachment.id;
    this.ownerType = attachment.ownerType;
    this.ownerId = attachment.ownerId;
    this.kind = attachment.kind;
    this.fileUri = attachment.fileUri;
    this.fileName = attachment.fileName;
    this.mimeType = attachment.mimeType;
    this.sizeBytes = attachment.sizeBytes;
    this.createdAt = attachment.createdAt;

    Object.freeze(this);
  }

  static create(input: CreateAttachmentProps): Attachment {
    const mimeType = input.mimeType.trim().toLowerCase();
    const sizeBytes = requireNonNegativeInteger(
      input.sizeBytes,
      'El tamaño debe ser un entero mayor o igual a cero.'
    );

    if (!mimeTypePattern.test(mimeType)) {
      throw new ValidationError('El archivo debe ser una imagen o un PDF.');
    }
    if (sizeBytes > maxAttachmentBytes) {
      throw new ValidationError('El archivo no puede superar los 10 MB.');
    }

    return new Attachment({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      ownerType: requireOneOf(
        input.ownerType,
        attachmentOwners,
        'El tipo de dueño no es válido.'
      ),
      ownerId: requireUuid(input.ownerId, 'El dueño debe ser un UUID válido.'),
      kind: requireOneOf(
        input.kind,
        attachmentKinds,
        'El tipo de adjunto no es válido.'
      ),
      fileUri: requireText(
        input.fileUri,
        'La ubicación del archivo es obligatoria.'
      ),
      fileName: requireText(
        input.fileName,
        'El nombre del archivo es obligatorio.'
      ),
      mimeType,
      sizeBytes,
      createdAt: requireIsoDate(
        input.createdAt,
        'La fecha de creación no es válida.'
      ),
    });
  }

  static normalizeId(id: string): string {
    return normalizeUuid(id);
  }
}
