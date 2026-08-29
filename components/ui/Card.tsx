'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, className = '', accent, hover, padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border bg-bg-surface
        ${accent ? 'border-gold/30' : 'border-white/8'}
        ${hover ? 'transition-all duration-200 hover:border-gold/30 hover:shadow-card-hover' : ''}
        shadow-card
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {icon && (
        <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-gold">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-text-primary leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
