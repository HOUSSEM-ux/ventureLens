'use client';
import React from 'react';
import type { Currency } from '@/lib/types';

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'TND', label: 'Tunisian Dinar', symbol: 'TND' },
];

interface CurrencySelectorProps {
  value: Currency;
  onChange: (value: Currency) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="currency" className="text-sm font-medium text-text-primary">
        Currency
      </label>
      <p className="text-xs text-text-muted -mt-1">All financial values will use this currency.</p>
      <div className="grid grid-cols-4 gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            aria-pressed={value === c.value}
            className={`
              py-2.5 px-3 rounded-xl border text-sm font-medium transition-all duration-150 cursor-pointer
              ${value === c.value
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/10 bg-bg-elevated text-text-muted hover:border-white/20 hover:text-text-primary'
              }
            `}
          >
            <div className="font-semibold">{c.symbol}</div>
            <div className="text-xs opacity-70 mt-0.5">{c.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
