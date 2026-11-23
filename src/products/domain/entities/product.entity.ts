// Entidad del dominio Product: compra del usuario y raíz de agregado de sus garantías.
// Centraliza sus reglas; sin ella, podrían circular productos sin categoría o con precios negativos.

// El constructor privado dirige la creación a create() o restore() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { ValidationError } from '@/shared/domain/errors/domain.errors';
import {
  optionalText,
  requireIsoDate,
  requireText,
  requireUuid,
} from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';
import { createMoney, type Money } from '@/shared/domain/value-objects/money';

export interface CreateProductData {
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  categoryId: string;
  storeId?: string;
  purchaseDate: IsoDate;
  purchasePrice?: Money;
  imageUri?: string;
  notes?: string;
}

export interface CreateProductProps extends CreateProductData {
  id: string;
  createdAt: IsoDate;
}

// Datos completos de un producto que ya existe.
export interface RestoreProductProps extends CreateProductProps {
  updatedAt: IsoDate;
}

export class Product {
  readonly id: string; // UUID
  readonly name: string;
  readonly brand?: string;
  readonly model?: string;
  readonly serialNumber?: string;
  readonly categoryId: string;
  readonly storeId?: string;
  readonly purchaseDate: IsoDate;
  readonly purchasePrice?: Money;
  readonly imageUri?: string;
  readonly notes?: string;
  readonly createdAt: IsoDate;
  readonly updatedAt: IsoDate;

  private constructor(product: RestoreProductProps) {
    this.id = product.id;
    this.name = product.name;
    this.brand = product.brand;
    this.model = product.model;
    this.serialNumber = product.serialNumber;
    this.categoryId = product.categoryId;
    this.storeId = product.storeId;
    this.purchaseDate = product.purchaseDate;
    this.purchasePrice = product.purchasePrice;
    this.imageUri = product.imageUri;
    this.notes = product.notes;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;

    Object.freeze(this);
  }

  static create(input: CreateProductProps): Product {
    return Product.restore({ ...input, updatedAt: input.createdAt });
  }

  static restore(input: RestoreProductProps): Product {
    const storeId = optionalText(input.storeId);
    const purchasePrice =
      input.purchasePrice && createMoney(input.purchasePrice);

    if (purchasePrice && purchasePrice.amountCents < 0) {
      throw new ValidationError('El precio de compra no puede ser negativo.');
    }

    return new Product({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      name: requireText(input.name, 'El nombre es obligatorio.'),
      brand: optionalText(input.brand),
      model: optionalText(input.model),
      serialNumber: optionalText(input.serialNumber),
      categoryId: requireUuid(
        input.categoryId,
        'La categoría debe ser un UUID válido.'
      ),
      storeId:
        storeId && requireUuid(storeId, 'La tienda debe ser un UUID válido.'),
      purchaseDate: requireIsoDate(
        input.purchaseDate,
        'La fecha de compra no es válida.'
      ),
      purchasePrice,
      imageUri: optionalText(input.imageUri),
      notes: optionalText(input.notes),
      createdAt: requireIsoDate(
        input.createdAt,
        'La fecha de creación no es válida.'
      ),
      updatedAt: requireIsoDate(
        input.updatedAt,
        'La fecha de actualización no es válida.'
      ),
    });
  }

  // Un campo opcional enviado como undefined se borra.
  update(changes: Partial<CreateProductData>, updatedAt: IsoDate): Product {
    return Product.restore({
      ...this,
      ...changes,
      id: this.id,
      createdAt: this.createdAt,
      updatedAt,
    });
  }

  static normalizeId(id: string): string {
    return normalizeUuid(id);
  }
}
