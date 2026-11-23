// Traduce los errores de dominio a mensajes para el usuario.

import { ConflictError, NotFoundError, ValidationError } from '@/shared/domain/errors/domain.errors';

export function toErrorMessage(error: unknown): string {
  if (
    error instanceof ValidationError ||
    error instanceof ConflictError ||
    error instanceof NotFoundError
  ) {
    return error.message;
  }
  return 'Ocurrió un error inesperado. Inténtalo más tarde.';
}
