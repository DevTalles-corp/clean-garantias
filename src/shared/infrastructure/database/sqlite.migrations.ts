// Infraestructura: esquema de SQLite y sus cambios, en orden.
// PRAGMA user_version guarda cuántas migraciones se han aplicado.

import type { SQLiteDatabase } from 'expo-sqlite';

// Nunca se edita una migración publicada: se agrega otra al final.
const migrations: readonly string[] = [
  `
  CREATE TABLE categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    default_warranty_months INTEGER NOT NULL,
    is_system INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE stores (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    website TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE products (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    brand TEXT,
    model TEXT,
    serial_number TEXT,
    category_id TEXT NOT NULL REFERENCES categories (id),
    store_id TEXT REFERENCES stores (id),
    purchase_date TEXT NOT NULL,
    price_amount_cents INTEGER,
    price_currency TEXT,
    image_uri TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    CHECK ((price_amount_cents IS NULL) = (price_currency IS NULL))
  );
  CREATE INDEX products_category_id ON products (category_id);
  CREATE INDEX products_store_id ON products (store_id);

  CREATE TABLE warranties (
    id TEXT PRIMARY KEY NOT NULL,
    product_id TEXT NOT NULL REFERENCES products (id),
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    start_date TEXT NOT NULL,
    duration_months INTEGER NOT NULL,
    policy_number TEXT,
    coverage TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    is_archived INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX warranties_product_id ON warranties (product_id);

  CREATE TABLE reminders (
    id TEXT PRIMARY KEY NOT NULL,
    warranty_id TEXT NOT NULL REFERENCES warranties (id),
    offset_days INTEGER NOT NULL,
    fire_at TEXT NOT NULL,
    notification_id TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX reminders_warranty_id ON reminders (warranty_id);
  CREATE INDEX reminders_status ON reminders (status);

  CREATE TABLE claims (
    id TEXT PRIMARY KEY NOT NULL,
    warranty_id TEXT NOT NULL REFERENCES warranties (id),
    issue TEXT NOT NULL,
    status TEXT NOT NULL,
    ticket_number TEXT,
    opened_at TEXT NOT NULL,
    resolved_at TEXT,
    resolution TEXT,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX claims_warranty_id ON claims (warranty_id);

  CREATE TABLE attachments (
    id TEXT PRIMARY KEY NOT NULL,
    owner_type TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    file_uri TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX attachments_owner ON attachments (owner_type, owner_id);

  CREATE TABLE settings (
    id INTEGER PRIMARY KEY NOT NULL CHECK (id = 1),
    currency TEXT NOT NULL,
    locale TEXT NOT NULL,
    reminder_offsets_days TEXT NOT NULL,
    notifications_enabled INTEGER NOT NULL,
    theme TEXT NOT NULL,
    expiring_threshold_days INTEGER NOT NULL
  );
  `,
];

export async function migrateDatabase(database: SQLiteDatabase): Promise<void> {
  // Se configuran fuera de la transacción: dentro no tienen efecto.
  await database.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');

  const result = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const appliedCount = result?.user_version ?? 0;

  for (let index = appliedCount; index < migrations.length; index++) {
    // La migración y su versión se aplican juntas o no se aplican.
    await database.withTransactionAsync(async () => {
      await database.execAsync(migrations[index]);
      await database.execAsync(`PRAGMA user_version = ${index + 1}`);
    });
  }
}
