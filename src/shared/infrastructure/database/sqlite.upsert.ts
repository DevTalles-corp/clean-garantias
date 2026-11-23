// Infraestructura: crea o actualiza una fila según su id.
// No usa INSERT OR REPLACE porque borra la fila anterior y rompería las llaves foráneas.

import type { SQLiteBindValue, SQLiteDatabase } from 'expo-sqlite';

type SqliteRow = { id: string | number } & Record<string, SQLiteBindValue>;

// table y las columnas salen del código; los valores siempre viajan como parámetros.
export async function upsertRow(
  database: SQLiteDatabase,
  table: string,
  row: SqliteRow,
): Promise<void> {
  const columns = Object.keys(row);
  const placeholders = columns.map(() => '?').join(', ');
  const updates = columns
    .filter((column) => column !== 'id')
    .map((column) => `${column} = excluded.${column}`)
    .join(', ');

  await database.runAsync(
    `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})
     ON CONFLICT (id) DO UPDATE SET ${updates}`,
    Object.values(row),
  );
}
