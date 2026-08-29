import type { BusinessInputs, FinancialMetrics, Risk } from './types';

interface RiskContext {
  inputs: BusinessInputs;
  metrics: FinancialMetrics;
}

// ─── Individual risk detectors ─────────────────────────────────────────────────
function riskHighGrowthDependency({ inputs }: RiskContext): Risk | null {
  if (inputs.monthlyGrowthPct <= 20) return null;
  return {
    id: 'high-growth',
    title: 'High Growth Dependency',
    severity: 'high',
    assumption:
      `Your model assumes ${inputs.monthlyGrowthPct}% monthly customer growth. Sustaining this is rare and requires a proven acquisition channel.`,
    action:
      'Run a 2-week paid or organic acquisition experiment before building. Measure the real cost per acquired customer (CAC) and organic referral rate.',
    minEvidence:
      'At least 10 paying customers acquired through a repeatable channel without direct personal selling.',
    passFail:
      'Pass: CAC is below your contribution margin and at least 2 customers came through the channel independently. Fail: all customers required manual outreach.',
    estimatedTime: '2 weeks',
  };
}

function riskLowGrossMargin({ metrics }: RiskContext): Risk | null {
  const gm = metrics.grossMarginPct;
  if (gm === null || gm >= 40) return null;
  const severity = gm < 20 ? 'high' : 'medium';
  return {
    id: 'low-margin',
    title: 'Low Gross Margin',
    severity,
    assumption:
      `A ${gm.toFixed(0)}% gross margin leaves limited room to cover fixed costs and invest in growth. Sustainable businesses typically target 40 %+ gross margin.`,
    action:
      'Interview 5 potential customers to find out the highest price they would pay. Simultaneously get 3 supplier quotes to reduce variable costs by 10–15 %.',
    minEvidence:
      'At least one customer willing to pay a price that brings gross margin above 40 %.',
    passFail:
      'Pass: a revised pricing or cost structure yields 40 %+ gross margin without losing more than 20 % of interested buyers. Fail: price resistance prevents reaching that threshold.',
    estimatedTime: '1 week',
  };
}

function riskLongBreakEven({ metrics }: RiskContext): Risk | null {
  const bem = metrics.breakEvenMonth;
  if (bem === null || bem <= 12) return null;
  const severity = bem > 24 ? 'high' : 'medium';
  return {
    id: 'long-break-even',
    title: 'Long Break-Even Period',
    severity,
    assumption:
      `Breaking even in month ${bem} means ${bem} months of losses. That requires capital, resilience, and confident growth projections.`,
    action:
      'Map every cost and find 2 fixed costs you can reduce or defer. Model what it takes to reach break-even in under 6 months.',
    minEvidence:
      'A revised model reaching break-even within 6 months while retaining your core value proposition.',
    passFail:
      'Pass: revised assumptions are credible (supported by at least one real customer conversation). Fail: break-even still requires unrealistic growth.',
    estimatedTime: '3 days',
  };
}

function riskShortRunway({ metrics }: RiskContext): Risk | null {
  const runway = metrics.cashRunwayMonths;
  if (runway === null || runway >= 6) return null;
  const severity = runway < 3 ? 'high' : 'medium';
  return {
    id: 'short-runway',
    title: 'Short Cash Runway',
    severity,
    assumption:
      `With ${runway < 1 ? 'less than 1 month' : `${runway.toFixed(1)} months`} of runway, you have very little time to validate and iterate before running out of money.`,
    action:
      'Identify the minimum scope of the product that someone would pay for today. Pre-sell it before building — even informally.',
    minEvidence:
      '3 people who say "I will pay X for this" and at least 1 who has actually transferred money.',
    passFail:
      'Pass: pre-sale revenue or reduced burn extends runway past 6 months. Fail: no one commits to paying before the product exists.',
    estimatedTime: '1 week',
  };
}

function riskNegativeContribution({ metrics }: RiskContext): Risk | null {
  if (metrics.contributionPerCustomer > 0) return null;
  return {
    id: 'negative-contribution',
    title: 'Negative Unit Economics',
    severity: 'high',
    assumption:
      'Your variable cost per customer exceeds your price. Every sale makes you less money. The business cannot reach break-even under current assumptions.',
    action:
      'Do not acquire more customers until you fix pricing or costs. Either raise the price significantly or eliminate the highest-cost variable component.',
    minEvidence:
      'A revised cost structure where price − variable cost > 0, confirmed with at least one real supplier or customer.',
    passFail:
      'Pass: contribution per customer is positive and confirmed with real data. Fail: you cannot find a combination of price and cost that works.',
    estimatedTime: '3–5 days',
  };
}

function riskHighFixedCostBurden({ inputs, metrics }: RiskContext): Risk | null {
  if (metrics.monthlyRevenue === 0) return null;
  const ratio = inputs.fixedMonthlyCosts / metrics.monthlyRevenue;
  if (ratio <= 0.6) return null;
  return {
    id: 'high-fixed-costs',
    title: 'High Fixed Cost Burden',
    severity: ratio > 0.9 ? 'high' : 'medium',
    assumption:
      `Fixed costs represent ${(ratio * 100).toFixed(0)}% of your revenue. This makes the business fragile to any revenue shortfall.`,
    action:
      'List every fixed cost and classify it as essential, deferrable, or replaceable with a variable alternative (e.g. freelancer instead of employee).',
    minEvidence:
      'At least 20 % of fixed costs can be converted to variable or deferred without compromising core operations.',
    passFail:
      'Pass: revised fixed costs drop below 50 % of projected revenue. Fail: costs are contractually fixed and cannot be changed.',
    estimatedTime: '2 days',
  };
}

function riskNegativeInitialCash({ metrics }: RiskContext): Risk | null {
  if (!metrics.negativeInitialCash) return null;
  return {
    id: 'negative-initial-cash',
    title: 'Launch Costs Exceed Capital',
    severity: 'high',
    assumption:
      'Your one-time launch costs exceed your starting capital. The business starts underwater before earning a single sale.',
    action:
      'Find which launch costs can be deferred until after first revenue. Consider bootstrapping with a smaller initial scope.',
    minEvidence:
      'A launch plan that fits within starting capital while still delivering a testable product.',
    passFail:
      'Pass: revised launch plan has positive initial cash. Fail: minimum viable launch still exceeds available capital.',
    estimatedTime: '1–2 days',
  };
}

// ─── Main risk detector ────────────────────────────────────────────────────────
export function detectRisks(inputs: BusinessInputs, metrics: FinancialMetrics): Risk[] {
  const ctx: RiskContext = { inputs, metrics };
  const allRisks: (Risk | null)[] = [
    riskNegativeInitialCash(ctx),
    riskNegativeContribution(ctx),
    riskShortRunway(ctx),
    riskLowGrossMargin(ctx),
    riskHighGrowthDependency(ctx),
    riskLongBreakEven(ctx),
    riskHighFixedCostBurden(ctx),
  ];

  return allRisks
    .filter((r): r is Risk => r !== null)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    })
    .slice(0, 5); // Show top 5
}

// ─── Overall status ────────────────────────────────────────────────────────────
export function determineOverallStatus(
  metrics: FinancialMetrics,
  risks: Risk[]
): 'Promising' | 'Needs Validation' | 'High Risk' {
  const highRisks = risks.filter((r) => r.severity === 'high');

  if (
    !metrics.canBreakEven ||
    metrics.negativeInitialCash ||
    highRisks.length >= 2 ||
    (metrics.cashRunwayMonths !== null && metrics.cashRunwayMonths < 3)
  ) {
    return 'High Risk';
  }

  if (
    (metrics.grossMarginPct !== null && metrics.grossMarginPct >= 50) &&
    (metrics.alreadyProfitable ||
      (metrics.cashRunwayMonths !== null && metrics.cashRunwayMonths >= 6)) &&
    (metrics.breakEvenMonth === null || metrics.breakEvenMonth <= 12) &&
    highRisks.length === 0
  ) {
    return 'Promising';
  }

  return 'Needs Validation';
}
