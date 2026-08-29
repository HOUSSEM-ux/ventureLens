'use client';
import React from 'react';


interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  accent?: boolean;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, sub, trend, accent, size = 'md', icon }: MetricCardProps) {
  const trendColor =
    trend === 'positive'
      ? 'text-success'
      : trend === 'negative'
      ? 'text-danger'
      : 'text-text-primary';

  return (
    <div
      className={`
        rounded-2xl border bg-bg-surface p-5 transition-all duration-200
        hover:border-gold/25 hover:shadow-card-hover
        ${accent ? 'border-gold/30' : 'border-white/8'}
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{label}</p>
        {icon && <span className="text-gold opacity-70">{icon}</span>}
      </div>
      <p className={`font-bold leading-none ${size === 'md' ? 'text-2xl' : 'text-lg'} ${trendColor}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-text-muted mt-2 leading-relaxed">{sub}</p>}
    </div>
  );
}
