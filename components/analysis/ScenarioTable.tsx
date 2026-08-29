'use client';
import React from 'react';
import type { ScenarioResult } from '@/lib/types';
import type { Currency } from '@/lib/types';
import { formatCurrency, formatPct, formatMonths } from '@/lib/format';

interface ScenarioTableProps {
  scenarios: ScenarioResult[];
  currency: Currency;
}

export function ScenarioTable({ scenarios, currency }: ScenarioTableProps) {
  const rows = [
    {
      label: 'Monthly Customers',
      getValue: (s: ScenarioResult) => `${s.inputs.monthlyCustomers.toLocaleString()}`,
    },
    {
      label: 'Monthly Growth',
      getValue: (s: ScenarioResult) => formatPct(s.inputs.monthlyGrowthPct),
    },
    {
      label: 'Monthly Revenue',
      getValue: (s: ScenarioResult) => formatCurrency(s.metrics.monthlyRevenue, currency),
      highlight: true,
    },
    {
      label: 'Gross Margin',
      getValue: (s: ScenarioResult) => formatPct(s.metrics.grossMarginPct),
    },
    {
      label: 'Operating Profit',
      getValue: (s: ScenarioResult) => formatCurrency(s.metrics.monthlyOperatingProfit, currency),
      highlight: true,
    },
    {
      label: 'Break-Even Month',
      getValue: (s: ScenarioResult) =>
        s.metrics.breakEvenMonth === null
          ? s.metrics.canBreakEven ? '> 60 months' : 'Not achievable'
          : `Month ${s.metrics.breakEvenMonth}`,
    },
    {
      label: 'Cash Runway',
      getValue: (s: ScenarioResult) =>
        s.metrics.alreadyProfitable ? 'Profitable' : formatMonths(s.metrics.cashRunwayMonths),
    },
  ];

  const headerColors = [
    'text-warning',  // Conservative
    'text-gold',     // Base Case
    'text-success',  // Optimistic
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8">
      <table className="w-full text-sm" role="table">
        <thead>
          <tr className="border-b border-white/8">
            <th className="text-left px-5 py-4 text-text-muted font-medium text-xs uppercase tracking-wider w-1/3">
              Metric
            </th>
            {scenarios.map((s, i) => (
              <th
                key={s.label}
                className={`text-center px-4 py-4 font-semibold ${headerColors[i]}`}
              >
                <div>{s.label}</div>
                <div className="text-xs font-normal text-text-muted mt-0.5">
                  ×{s.customerMultiplier} customers · ×{s.costMultiplier} costs
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={row.label}
              className={`border-b border-white/5 ${ri % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
            >
              <td className="px-5 py-3.5 text-text-muted font-medium">{row.label}</td>
              {scenarios.map((s) => {
                const val = row.getValue(s);
                const isNeg = val.startsWith('−') || val.includes('Not achievable');
                return (
                  <td
                    key={s.label}
                    className={`
                      px-4 py-3.5 text-center font-${row.highlight ? 'semibold' : 'normal'}
                      ${isNeg ? 'text-danger' : row.highlight ? 'text-text-primary' : 'text-text-muted'}
                    `}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
