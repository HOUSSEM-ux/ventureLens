'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { ScenarioResult } from '@/lib/types';
import type { Currency } from '@/lib/types';
import { CURRENCY_SYMBOLS } from '@/lib/format';

interface ScenarioChartProps {
  scenarios: ScenarioResult[];
  currency: Currency;
}

const COLORS = ['#F59E0B', '#C9A84C', '#22C55E'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, sym }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl p-3 text-xs shadow-xl min-w-[160px]">
      <p className="font-semibold text-text-primary mb-2">{label}</p>
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

export function ScenarioChart({ scenarios, currency }: ScenarioChartProps) {
  const sym = CURRENCY_SYMBOLS[currency];

  const data = [
    {
      metric: 'Revenue',
      ...Object.fromEntries(scenarios.map((s) => [s.label, s.metrics.monthlyRevenue])),
    },
    {
      metric: 'Gross Profit',
      ...Object.fromEntries(scenarios.map((s) => [s.label, s.metrics.grossProfit])),
    },
    {
      metric: 'Op. Profit',
      ...Object.fromEntries(scenarios.map((s) => [s.label, s.metrics.monthlyOperatingProfit])),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis
          dataKey="metric"
          tick={{ fill: '#8A9BB8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8A9BB8', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${sym}${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip sym={sym} />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#8A9BB8', fontSize: 11 }}>{value}</span>
          )}
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
        {scenarios.map((s, i) => (
          <Bar
            key={s.label}
            dataKey={s.label}
            fill={COLORS[i]}
            radius={[4, 4, 0, 0]}
            fillOpacity={0.85}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
