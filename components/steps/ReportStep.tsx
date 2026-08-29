'use client';
import React, { useState } from 'react';
import type { AnalysisResult } from '@/lib/types';
import { formatCurrency, formatPct, formatMonths, CURRENCY_SYMBOLS } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ReportStepProps {
  result: AnalysisResult;
  onBack: () => void;
}

const statusVariant = {
  'Promising': 'success',
  'Needs Validation': 'warning',
  'High Risk': 'danger',
} as const;

const statusDescription = {
  'Promising': 'The fundamentals look sound. Focus on execution and scaling your customer acquisition.',
  'Needs Validation': 'The idea could work, but one or more key assumptions need to be tested before committing significant resources.',
  'High Risk': 'Critical assumptions are either unvalidated or structurally problematic. Fix the flagged issues before investing further.',
};

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm text-text-primary font-medium text-right">{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-3 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

export function ReportStep({ result, onBack }: ReportStepProps) {
  const [copied, setCopied] = useState(false);
  const { inputs, metrics, scenarios, risks, overallStatus } = result;
  const { currency } = inputs;
  const sym = CURRENCY_SYMBOLS[currency];

  // ── Plain text report for clipboard ──
  function buildPlainText(): string {
    const lines: string[] = [];
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('  VENTURELENS DECISION REPORT');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push(`Business: ${inputs.businessName}`);
    if (inputs.description) lines.push(`Description: ${inputs.description}`);
    lines.push(`Overall status: ${overallStatus}`);
    lines.push('');
    lines.push('── Key Assumptions ──────────────────────');
    lines.push(`Selling price: ${sym}${inputs.avgPrice}`);
    lines.push(`Month-1 customers: ${inputs.monthlyCustomers}`);
    lines.push(`Monthly growth: ${inputs.monthlyGrowthPct}%`);
    lines.push(`Variable cost / customer: ${sym}${inputs.variableCostPerCustomer}`);
    lines.push(`Fixed monthly costs: ${sym}${inputs.fixedMonthlyCosts}`);
    lines.push(`Starting capital: ${sym}${inputs.startingCapital}`);
    lines.push(`Launch costs: ${sym}${inputs.launchCosts}`);
    lines.push(`Churn: ${inputs.churnPct}% / month`);
    lines.push('');
    lines.push('── Financial Metrics (Month 1) ──────────');
    lines.push(`Monthly revenue: ${formatCurrency(metrics.monthlyRevenue, currency)}`);
    lines.push(`Gross profit: ${formatCurrency(metrics.grossProfit, currency)}`);
    lines.push(`Gross margin: ${formatPct(metrics.grossMarginPct)}`);
    lines.push(`Contribution / customer: ${formatCurrency(metrics.contributionPerCustomer, currency)}`);
    lines.push(`Operating profit: ${formatCurrency(metrics.monthlyOperatingProfit, currency)}`);
    lines.push(`Break-even customers: ${metrics.canBreakEven ? metrics.breakEvenCustomers : 'Not achievable'}`);
    lines.push(`Break-even month: ${metrics.breakEvenMonth ?? (metrics.canBreakEven ? '> 60' : 'N/A')}`);
    lines.push(`Cash runway: ${metrics.alreadyProfitable ? 'Already profitable' : formatMonths(metrics.cashRunwayMonths)}`);
    lines.push('');
    lines.push('── Scenario Comparison ──────────────────');
    scenarios.forEach((s) => {
      lines.push(`${s.label}: Revenue ${formatCurrency(s.metrics.monthlyRevenue, currency)} | Op. Profit ${formatCurrency(s.metrics.monthlyOperatingProfit, currency)}`);
    });
    lines.push('');
    lines.push('── Top Risks ────────────────────────────');
    risks.slice(0, 3).forEach((r, i) => {
      lines.push(`${i + 1}. [${r.severity.toUpperCase()}] ${r.title}`);
      lines.push(`   Assumption: ${r.assumption}`);
      lines.push(`   Action: ${r.action}`);
      lines.push('');
    });
    if (risks.length > 0) {
      lines.push('── Recommended First Experiment ─────────');
      const top = risks[0];
      lines.push(`Assumption to test: ${top.assumption}`);
      lines.push(`What to do: ${top.action}`);
      lines.push(`Minimum evidence: ${top.minEvidence}`);
      lines.push(`Pass/Fail: ${top.passFail}`);
      lines.push(`Time: ${top.estimatedTime}`);
    }
    lines.push('');
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('VentureLens is an educational tool, not financial advice.');
    lines.push('venturelens.app');
    return lines.join('\n');
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildPlainText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 no-print">
        <Button variant="ghost" size="sm" onClick={onBack}>← Back to analysis</Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleCopy} id="copy-report-btn">
            {copied ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg> Copy report</>
            )}
          </Button>
          <Button size="sm" onClick={handlePrint} id="print-report-btn">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
            Print
          </Button>
        </div>
      </div>

      {/* Report card */}
      <div className="rounded-2xl border border-white/10 bg-bg-surface overflow-hidden" id="report-content">
        {/* Report header */}
        <div className="px-8 py-7 border-b border-white/8 bg-gradient-to-r from-bg-elevated to-bg-surface">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-text-muted font-medium uppercase tracking-widest mb-1">Decision Report</p>
              <h1 className="text-2xl font-bold text-text-primary">{inputs.businessName || 'Untitled Business'}</h1>
              {inputs.description && (
                <p className="text-sm text-text-muted mt-1 max-w-md">{inputs.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={statusVariant[overallStatus]} size="md" dot>{overallStatus}</Badge>
              <p className="text-xs text-text-muted text-right">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-bg-base/40 border border-white/8">
            <p className="text-sm text-text-muted leading-relaxed">{statusDescription[overallStatus]}</p>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Assumptions */}
          <SectionTitle>Key Assumptions</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              <ReportRow label="Selling price / customer" value={formatCurrency(inputs.avgPrice, currency)} />
              <ReportRow label="Month-1 customers" value={inputs.monthlyCustomers.toLocaleString()} />
              <ReportRow label="Monthly growth rate" value={formatPct(inputs.monthlyGrowthPct)} />
              <ReportRow label="Monthly churn" value={formatPct(inputs.churnPct)} />
            </div>
            <div>
              <ReportRow label="Variable cost / customer" value={formatCurrency(inputs.variableCostPerCustomer, currency)} />
              <ReportRow label="Fixed monthly costs" value={formatCurrency(inputs.fixedMonthlyCosts, currency)} />
              <ReportRow label="Starting capital" value={formatCurrency(inputs.startingCapital, currency)} />
              <ReportRow label="Launch costs" value={formatCurrency(inputs.launchCosts, currency)} />
            </div>
          </div>

          {/* Financial metrics */}
          <SectionTitle>Financial Metrics (Month 1)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <div>
              <ReportRow label="Monthly revenue" value={formatCurrency(metrics.monthlyRevenue, currency)} />
              <ReportRow label="Variable costs" value={formatCurrency(metrics.variableCosts, currency)} />
              <ReportRow label="Gross profit" value={formatCurrency(metrics.grossProfit, currency)} />
              <ReportRow label="Gross margin" value={formatPct(metrics.grossMarginPct)} />
            </div>
            <div>
              <ReportRow label="Contribution / customer" value={formatCurrency(metrics.contributionPerCustomer, currency)} />
              <ReportRow label="Operating profit" value={formatCurrency(metrics.monthlyOperatingProfit, currency)} />
              <ReportRow
                label="Break-even customers"
                value={metrics.canBreakEven ? String(metrics.breakEvenCustomers ?? '—') : 'Not achievable'}
              />
              <ReportRow
                label="Cash runway"
                value={metrics.alreadyProfitable ? 'Already profitable' : formatMonths(metrics.cashRunwayMonths)}
              />
            </div>
          </div>

          {/* Scenario comparison */}
          <SectionTitle>Scenario Comparison</SectionTitle>
          <div className="rounded-xl border border-white/8 overflow-hidden mb-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 bg-bg-elevated">
                  <th className="text-left px-4 py-3 text-text-muted text-xs font-medium">Scenario</th>
                  <th className="text-right px-4 py-3 text-text-muted text-xs font-medium">Revenue</th>
                  <th className="text-right px-4 py-3 text-text-muted text-xs font-medium">Op. Profit</th>
                  <th className="text-right px-4 py-3 text-text-muted text-xs font-medium">Break-even</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s, i) => (
                  <tr key={s.label} className={`border-b border-white/5 ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 font-medium text-text-primary">{s.label}</td>
                    <td className="px-4 py-3 text-right text-text-muted">{formatCurrency(s.metrics.monthlyRevenue, currency)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${s.metrics.monthlyOperatingProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatCurrency(s.metrics.monthlyOperatingProfit, currency)}
                    </td>
                    <td className="px-4 py-3 text-right text-text-muted">
                      {s.metrics.breakEvenMonth ? `Month ${s.metrics.breakEvenMonth}` : s.metrics.canBreakEven ? '> 60 months' : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top risks */}
          {risks.length > 0 && (
            <>
              <SectionTitle>Top Risks</SectionTitle>
              <div className="flex flex-col gap-3 mb-2">
                {risks.slice(0, 3).map((risk, i) => (
                  <div key={risk.id} className="rounded-xl border border-white/8 bg-bg-elevated px-4 py-3 flex items-start gap-3">
                    <Badge
                      variant={risk.severity === 'high' ? 'danger' : risk.severity === 'medium' ? 'warning' : 'gold'}
                      dot
                    >
                      {risk.severity}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{risk.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{risk.assumption}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended experiment */}
              <SectionTitle>Recommended First Experiment</SectionTitle>
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
                <p className="text-xs font-semibold text-gold uppercase tracking-wider mb-3">{risks[0].title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'What to do', value: risks[0].action },
                    { label: 'Minimum evidence', value: risks[0].minEvidence },
                    { label: 'Pass / Fail', value: risks[0].passFail },
                    { label: 'Time required', value: risks[0].estimatedTime },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs font-medium text-text-muted mb-1">{item.label}</p>
                      <p className="text-sm text-text-primary leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/8">
            <p className="text-xs text-text-faint leading-relaxed text-center">
              VentureLens is an educational decision-support tool, not financial or investment advice.
              Projections are estimates based on user-provided assumptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
