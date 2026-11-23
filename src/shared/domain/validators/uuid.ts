// Validador de dominio: reconoce identificadores UUID y los normaliza.
// Unifica el formato de las llaves; sin él, cada entidad aceptaría ids distintos.

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return uuidPattern.test(value);
}

export function normalizeUuid(value: string): string {
  return value.trim().toLowerCase();
}
