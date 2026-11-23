// Value object CurrencyCode: monedas ISO-4217 que admite la aplicación.
// Fija la lista en un solo lugar; sin él, precios y configuración podrían usar monedas distintas.

export const currencyCodes = ['MXN', 'USD', 'EUR', 'COP', 'ARS', 'CLP', 'PEN'] as const;
export type CurrencyCode = (typeof currencyCodes)[number];
