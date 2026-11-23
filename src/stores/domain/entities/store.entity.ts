// Entidad del dominio Store: tienda o vendedor reutilizable entre productos.
// Centraliza sus reglas; sin ella, el autocompletado podría ofrecer tiendas inválidas.

// El constructor privado dirige la creación a create() en TypeScript.
// readonly protege en TypeScript; Object.freeze impide cambios en ejecución.

import { optionalText, requireIsoDate, requireText, requireUuid } from '@/shared/domain/validators/guards';
import { normalizeUuid } from '@/shared/domain/validators/uuid';
import type { IsoDate } from '@/shared/domain/value-objects/iso-date';

export interface CreateStoreData {
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CreateStoreProps extends CreateStoreData {
  id: string;
  createdAt: IsoDate;
}

export class Store {
  readonly id: string; // UUID
  readonly name: string;
  readonly website?: string;
  readonly phone?: string;
  readonly email?: string;
  readonly address?: string;
  readonly createdAt: IsoDate;

  private constructor(store: CreateStoreProps) {
    this.id = store.id;
    this.name = store.name;
    this.website = store.website;
    this.phone = store.phone;
    this.email = store.email;
    this.address = store.address;
    this.createdAt = store.createdAt;

    Object.freeze(this);
  }

  static create(input: CreateStoreProps): Store {
    return new Store({
      id: requireUuid(input.id, 'El id debe ser un UUID válido.'),
      name: requireText(input.name, 'El nombre es obligatorio.'),
      website: optionalText(input.website),
      phone: optionalText(input.phone),
      email: optionalText(input.email)?.toLowerCase(),
      address: optionalText(input.address),
      createdAt: requireIsoDate(input.createdAt, 'La fecha de creación no es válida.'),
    });
  }

  static normalizeId(id: string): string {
    return normalizeUuid(id);
  }
}
