import type { Currency } from './types';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  TND: 'TND ',
};

export function formatCurrency(value: number | null, currency: Currency): string {
  if (value === null || !isFinite(value)) return '—';
  const sym = CURRENCY_SYMBOLS[currency];
  const abs = Math.abs(value);
  const formatted =
    abs >= 1_000_000
      ? `${(abs / 1_000_000).toFixed(2)}M`
      : abs >= 1_000
      ? abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : abs.toFixed(2);
  return value < 0 ? `−${sym}${formatted}` : `${sym}${formatted}`;
}

export function formatPct(value: number | null): string {
  if (value === null || !isFinite(value)) return '—';
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number | null): string {
  if (value === null || !isFinite(value)) return '—';
  return Math.round(value).toLocaleString('en-US');
}

export function formatMonths(value: number | null): string {
  if (value === null) return '—';
  if (!isFinite(value)) return '—';
  if (value < 1) return '< 1 month';
  return `${value.toFixed(1)} months`;
}
