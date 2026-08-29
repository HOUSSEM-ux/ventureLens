'use client';
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { MonthlyProjectionRow } from '@/lib/types';
import type { Currency } from '@/lib/types';
import { CURRENCY_SYMBOLS } from '@/lib/format';

interface MonthlyProjectionChartProps {
  data: MonthlyProjectionRow[];
  currency: Currency;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, sym }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 text-xs shadow-xl min-w-[180px]">
      <p className="font-semibold text-text-primary mb-2">Month {label}</p>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <div key={i} className="flex justify-between gap-4 mb-1">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-text-primary font-medium">
            {entry.value < 0 ? '−' : ''}{sym}{Math.abs(entry.value).toFixed(0)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyProjectionChart({ data, currency }: MonthlyProjectionChartProps) {
  const sym = CURRENCY_SYMBOLS[currency];
  const breakEvenMonth = data.find((d) => d.operatingProfit >= 0)?.month;

  return (
    <div>
      {breakEvenMonth && (
        <p className="text-xs text-text-muted mb-3">
          <span className="text-gold font-medium">Break-even at month {breakEvenMonth}</span>
          {' '}— marked with a dashed line.
        </p>
      )}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#8A9BB8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `M${v}`}
          />
          <YAxis
            tick={{ fill: '#8A9BB8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip sym={sym} />} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" />
          {breakEvenMonth && (
            <ReferenceLine
              x={breakEvenMonth}
              stroke="#C9A84C"
              strokeDasharray="4 4"
              label={{ value: 'B/E', fill: '#C9A84C', fontSize: 10, position: 'top' }}
            />
          )}
          <Area
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#C9A84C"
            strokeWidth={2}
            fill="url(#revGrad)"
          />
          <Area
            type="monotone"
            dataKey="operatingProfit"
            name="Operating Profit"
            stroke="#22C55E"
            strokeWidth={2}
            fill="url(#profGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
