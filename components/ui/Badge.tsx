'use client';
import React from 'react';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'gold' | 'muted' | 'indigo';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success border-success/30',
  danger:  'bg-danger/15 text-danger border-danger/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  gold:    'bg-gold/15 text-gold border-gold/30',
  muted:   'bg-white/5 text-text-muted border-white/10',
  indigo:  'bg-indigo-chart/15 text-indigo-light border-indigo-chart/30',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success',
  danger:  'bg-danger',
  warning: 'bg-warning',
  gold:    'bg-gold',
  muted:   'bg-text-muted',
  indigo:  'bg-indigo-chart',
};

export function Badge({ children, variant = 'muted', size = 'sm', dot }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border rounded-full font-medium
        ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${variantClasses[variant]}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
