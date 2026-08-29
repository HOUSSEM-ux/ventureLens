'use client';
import React, { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { formatCurrency, formatPct, formatMonths } from '@/lib/format';
import { MetricCard } from '@/components/analysis/MetricCard';
import { ScenarioTable } from '@/components/analysis/ScenarioTable';
import { ScenarioChart } from '@/components/analysis/ScenarioChart';
import { RiskCard } from '@/components/analysis/RiskCard';
import { MonthlyProjectionChart } from '@/components/analysis/MonthlyProjectionChart';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ResultsStepProps {
  result: AnalysisResult;
  onViewReport: () => void;
  onBack: () => void;
}

const statusVariant = {
  'Promising': 'success',
  'Needs Validation': 'warning',
  'High Risk': 'danger',
} as const;

type TabDef = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: (r: AnalysisResult) => string | undefined;
};

const TABS: TabDef[] = [
  {
    id: 'financials',
    label: 'Financials',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" />
      </svg>
    ),
  },
  {
    id: 'scenarios',
    label: 'Scenarios',
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    id: 'risks',
    label: 'Risks & Validation',
    badge: (r: AnalysisResult) =>
      r.risks.filter(risk => risk.severity === 'high').length > 0
        ? String(r.risks.filter(risk => risk.severity === 'high').length)
        : undefined,
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
];

export function ResultsStep({ result, onViewReport, onBack }: ResultsStepProps) {
  const [activeTab, setActiveTab] = useState('financials');
  const { metrics, scenarios, risks, overallStatus, monthlyProjection, inputs } = result;
  const { currency } = inputs;

  const tabs = TABS.map(t => ({
    id: t.id,
    label: t.label,
    icon: t.icon,
    badge: t.badge ? t.badge(result) : undefined,
  }));

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-text-primary">{inputs.businessName || 'Your Business'}</h2>
            <Badge variant={statusVariant[overallStatus]} dot size="md">{overallStatus}</Badge>
          </div>
          {inputs.description && (
            <p className="text-sm text-text-muted max-w-lg">{inputs.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← Edit inputs
          </Button>
          <Button size="sm" onClick={onViewReport}>
            View report →
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* ── Financials tab ── */}
      {activeTab === 'financials' && (
        <div role="tabpanel" id="tab-panel-financials" className="animate-fade-in">
          {/* Warnings */}
          {metrics.negativeInitialCash && (
            <div className="mb-4 p-4 rounded-xl border border-danger/30 bg-danger/5 flex gap-3">
              <span className="text-danger flex-shrink-0">⚠</span>
              <p className="text-sm text-danger">
                <strong>Launch costs exceed capital.</strong> Your initial cash position is{' '}
                {formatCurrency(metrics.initialCash, currency)}. You would start the business already in debt.
              </p>
            </div>
          )}
          {!metrics.canBreakEven && (
            <div className="mb-4 p-4 rounded-xl border border-danger/30 bg-danger/5 flex gap-3">
              <span className="text-danger flex-shrink-0">⚠</span>
              <p className="text-sm text-danger">
                <strong>Break-even is not achievable.</strong> Your variable cost per customer ({formatCurrency(inputs.variableCostPerCustomer, currency)}) equals
                or exceeds your selling price ({formatCurrency(inputs.avgPrice, currency)}). Every sale loses money.
              </p>
            </div>
          )}

          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Monthly Revenue"
              value={formatCurrency(metrics.monthlyRevenue, currency)}
              trend="neutral"
              accent
            />
            <MetricCard
              label="Gross Profit"
              value={formatCurrency(metrics.grossProfit, currency)}
              trend={metrics.grossProfit > 0 ? 'positive' : 'negative'}
            />
            <MetricCard
              label="Gross Margin"
              value={formatPct(metrics.grossMarginPct)}
              sub={
                metrics.grossMarginPct !== null
                  ? metrics.grossMarginPct >= 50
                    ? 'Healthy margin'
                    : metrics.grossMarginPct >= 30
                    ? 'Acceptable — watch costs'
                    : 'Below target — improve pricing or cut variable costs'
                  : undefined
              }
              trend={
                metrics.grossMarginPct !== null
                  ? metrics.grossMarginPct >= 50 ? 'positive' : metrics.grossMarginPct >= 30 ? 'neutral' : 'negative'
                  : 'neutral'
              }
            />
            <MetricCard
              label="Operating Profit"
              value={formatCurrency(metrics.monthlyOperatingProfit, currency)}
              trend={metrics.monthlyOperatingProfit >= 0 ? 'positive' : 'negative'}
              sub={metrics.alreadyProfitable ? 'Profitable from month 1' : 'Currently loss-making'}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              label="Contribution / Customer"
              value={formatCurrency(metrics.contributionPerCustomer, currency)}
              trend={metrics.contributionPerCustomer > 0 ? 'positive' : 'negative'}
              sub="Price minus variable cost per sale"
            />
            <MetricCard
              label="Break-Even Customers"
              value={metrics.canBreakEven ? String(metrics.breakEvenCustomers ?? '—') : 'Not achievable'}
              trend={metrics.canBreakEven ? 'positive' : 'negative'}
              sub={metrics.canBreakEven && metrics.breakEvenCustomers ? `${formatCurrency(metrics.breakEvenRevenue, currency)} / month needed` : undefined}
            />
            <MetricCard
              label="Break-Even Month"
              value={
                metrics.breakEvenMonth === null
                  ? metrics.canBreakEven ? '> 60 months' : '—'
                  : metrics.breakEvenMonth === 1 ? 'Month 1 (Day 1)' : `Month ${metrics.breakEvenMonth}`
              }
              trend={metrics.breakEvenMonth && metrics.breakEvenMonth <= 12 ? 'positive' : 'negative'}
            />
            <MetricCard
              label="Cash Runway"
              value={
                metrics.alreadyProfitable
                  ? 'Cash positive'
                  : metrics.negativeInitialCash
                  ? 'No runway'
                  : formatMonths(metrics.cashRunwayMonths)
              }
              trend={
                metrics.alreadyProfitable
                  ? 'positive'
                  : metrics.cashRunwayMonths !== null && metrics.cashRunwayMonths >= 6
                  ? 'neutral'
                  : 'negative'
              }
              sub={metrics.alreadyProfitable ? 'Business is cashflow positive' : `Initial cash: ${formatCurrency(metrics.initialCash, currency)}`}
            />
          </div>

          {/* Monthly projection chart */}
          <div className="rounded-2xl border border-white/8 bg-bg-surface p-6">
            <h3 className="font-semibold text-text-primary mb-1">12-Month Projection</h3>
            <p className="text-xs text-text-muted mb-5">Based on your base-case assumptions with compound growth and churn applied monthly.</p>
            <MonthlyProjectionChart data={monthlyProjection} currency={currency} />
          </div>
        </div>
      )}

      {/* ── Scenarios tab ── */}
      {activeTab === 'scenarios' && (
        <div role="tabpanel" id="tab-panel-scenarios" className="animate-fade-in">
          <div className="mb-6">
            <h3 className="font-semibold text-text-primary mb-1">Scenario Analysis</h3>
            <p className="text-sm text-text-muted">
              Three scenarios built from your base assumptions. Conservative reduces customers by 40% and raises costs by 20%. Optimistic increases customers by 40% and cuts costs by 10%.
            </p>
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-white/8 bg-bg-surface p-6 mb-6">
            <h4 className="font-medium text-text-primary mb-4 text-sm">Revenue, Gross Profit & Operating Profit by Scenario</h4>
            <ScenarioChart scenarios={scenarios} currency={currency} />
          </div>

          {/* Table */}
          <ScenarioTable scenarios={scenarios} currency={currency} />
        </div>
      )}

      {/* ── Risks tab ── */}
      {activeTab === 'risks' && (
        <div role="tabpanel" id="tab-panel-risks" className="animate-fade-in">
          <div className="mb-6">
            <h3 className="font-semibold text-text-primary mb-1">Risk Assessment & Validation Plan</h3>
            <p className="text-sm text-text-muted">
              The following risks were identified from your assumptions. Each comes with a concrete experiment you can run before spending more money.
            </p>
          </div>

          {risks.length === 0 ? (
            <div className="rounded-2xl border border-success/30 bg-success/5 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">No major risks detected</h4>
              <p className="text-sm text-text-muted">Your assumptions appear realistic. Proceed to the report for a full summary.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {risks.map((risk, i) => (
                <RiskCard key={risk.id} risk={risk} index={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/8 no-print">
        <Button variant="ghost" onClick={onBack}>← Edit inputs</Button>
        <Button onClick={onViewReport}>
          View full report →
        </Button>
      </div>
    </div>
  );
}
