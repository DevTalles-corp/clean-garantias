import type { CurrencyCode } from '@/shared/domain/value-objects/currency-code';
import type { Money } from '@/shared/domain/value-objects/money';

const formats: Record<CurrencyCode, { prefix: string; locale: string }> = {
  CLP: { prefix: '$', locale: 'es-CL' },
  USD: { prefix: 'US$', locale: 'en-US' },
  EUR: { prefix: '€', locale: 'es-ES' },
  MXN: { prefix: 'MX$', locale: 'es-MX' },
  COP: { prefix: 'COL$', locale: 'es-CO' },
  ARS: { prefix: 'AR$', locale: 'es-AR' },
  PEN: { prefix: 'S/', locale: 'es-PE' },
};

// Se muestra sin decimales, como en el diseño.
export function formatMoney(money: Money | undefined): string {
  if (!money) return '—';
  const { prefix, locale } = formats[money.currency];
  return prefix + Math.round(money.amountCents / 100).toLocaleString(locale);
}
