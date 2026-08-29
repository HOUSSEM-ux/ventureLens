'use client';
import React from 'react';
import type { Risk } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface RiskCardProps {
  risk: Risk;
  index: number;
}

const severityVariant = { high: 'danger', medium: 'warning', low: 'gold' } as const;

export function RiskCard({ risk, index }: RiskCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-bg-surface overflow-hidden animate-slide-up">
      {/* Header */}
      <div className={`
        px-6 py-4 border-b border-white/8 flex items-start justify-between gap-4
        ${risk.severity === 'high' ? 'bg-danger/5' : risk.severity === 'medium' ? 'bg-warning/5' : 'bg-gold/5'}
      `}>
        <div className="flex items-center gap-3">
          <span className={`
            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
            ${risk.severity === 'high' ? 'bg-danger/20 text-danger' : risk.severity === 'medium' ? 'bg-warning/20 text-warning' : 'bg-gold/20 text-gold'}
          `}>
            {index + 1}
          </span>
          <h4 className="font-semibold text-text-primary">{risk.title}</h4>
        </div>
        <Badge variant={severityVariant[risk.severity]} dot>
          {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
        </Badge>
      </div>

      {/* Assumption */}
      <div className="px-6 py-4 border-b border-white/8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">The Assumption</p>
        <p className="text-sm text-text-primary leading-relaxed">{risk.assumption}</p>
      </div>

      {/* Validation experiment */}
      <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ExperimentRow label="Action" value={risk.action} />
        <ExperimentRow label="Minimum evidence" value={risk.minEvidence} />
        <ExperimentRow label="Pass / Fail criterion" value={risk.passFail} />
        <ExperimentRow label="Time required" value={risk.estimatedTime} icon="⏱" />
      </div>
    </div>
  );
}

function ExperimentRow({ label, value, icon }: { label: string; value: string; icon?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
        {icon && <span className="mr-1">{icon}</span>}{label}
      </p>
      <p className="text-sm text-text-primary leading-relaxed">{value}</p>
    </div>
  );
}
