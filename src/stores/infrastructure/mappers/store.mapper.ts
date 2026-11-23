// Mapper StoreMapper: convierte filas de SQLite en entidades Store y viceversa.
// Evita que la forma de la tabla llegue al dominio.

import { Store } from '@/stores/domain/entities/store.entity';

// Fila de la tabla stores. Es type y no interface para poder enviarse a upsertRow.
export type StoreRow = {
  id: string;
  name: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
};

export class StoreMapper {
  static toDomain(row: StoreRow): Store {
    // La entidad valida los valores: un dato corrupto lanza ValidationError.
    return Store.create({
      id: row.id,
      name: row.name,
      website: row.website ?? undefined,
      phone: row.phone ?? undefined,
      email: row.email ?? undefined,
      address: row.address ?? undefined,
      createdAt: row.created_at,
    });
  }

  static toRow(store: Store): StoreRow {
    return {
      id: store.id,
      name: store.name,
      website: store.website ?? null,
      phone: store.phone ?? null,
      email: store.email ?? null,
      address: store.address ?? null,
      created_at: store.createdAt,
    };
  }
}
