// Entidad del dominio Category: clasifica productos y sugiere la duración de su garantía.
// Centraliza esas garantías; sin ella, podrían circular categorías con colores o duraciones inválidas.

// El constructor privado dirige la creación a create() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { ValidationError } from '@/shared/domain/errors/domain.errors';
import {
  requireIsoDate,
  requireText,
  requireUuid,
} from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import { isWarrantyDuration } from '@/shared/domain/validators/warranty-duration';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

const hexColorPattern = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export interface CreateCategoryData {
  name: string;
  icon: string; // nombre de SF Symbol
  color: string; // #hex
  defaultWarrantyMonths: number;
}

export interface CreateCategoryProps extends CreateCategoryData {
  id: string;
  isSystem?: boolean; // true solo para la semilla inicial
  createdAt: IsoDate;
}

export class Category {
  readonly id: string; // UUID
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly defaultWarrantyMonths: number;
  readonly isSystem: boolean;
  readonly createdAt: IsoDate;

  private constructor(category: Required<CreateCategoryProps>) {
    this.id = category.id;
    this.name = category.name;
    this.icon = category.icon;
    this.color = category.color;
    this.defaultWarrantyMonths = category.defaultWarrantyMonths;
    this.isSystem = category.isSystem;
    this.createdAt = category.createdAt;

    Object.freeze(this);
  }

  static create(input: CreateCategoryProps): Category {
    const { defaultWarrantyMonths, isSystem = false } = input;
    const color = input.color.trim();

    if (!hexColorPattern.test(color)) {
      throw new ValidationError(
        'El color debe ser un valor hexadecimal válido.'
      );
    }
    if (!isWarrantyDuration(defaultWarrantyMonths)) {
      throw new ValidationError(
        'La duración sugerida debe ser un entero entre 1 y 240 meses.'
      );
    }

    return new Category({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      name: requireText(input.name, 'El nombre es obligatorio.'),
      icon: requireText(input.icon, 'El ícono es obligatorio.'),
      color,
      defaultWarrantyMonths,
      isSystem,
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
