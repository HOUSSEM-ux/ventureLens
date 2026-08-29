import type { BusinessInputs, FinancialMetrics, MonthlyProjectionRow } from './types';

// ─── Safe helpers ──────────────────────────────────────────────────────────────
function safeDiv(numerator: number, denominator: number): number | null {
  if (!isFinite(denominator) || denominator === 0) return null;
  const result = numerator / denominator;
  return isFinite(result) ? result : null;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ─── Core calculation ──────────────────────────────────────────────────────────
export function calculateMetrics(inputs: BusinessInputs): FinancialMetrics {
  const {
    avgPrice,
    monthlyCustomers,
    variableCostPerCustomer,
    fixedMonthlyCosts,
    startingCapital,
    launchCosts,
  } = inputs;

  // Revenue & costs
  const monthlyRevenue = round2(avgPrice * monthlyCustomers);
  const variableCosts = round2(variableCostPerCustomer * monthlyCustomers);
  const grossProfit = round2(monthlyRevenue - variableCosts);
  const grossMarginPct =
    monthlyRevenue > 0 ? round2((grossProfit / monthlyRevenue) * 100) : null;

  // Contribution per customer
  const contributionPerCustomer = round2(avgPrice - variableCostPerCustomer);

  // Break-even
  let breakEvenCustomers: number | null = null;
  let breakEvenRevenue: number | null = null;
  const canBreakEven = contributionPerCustomer > 0;

  if (canBreakEven) {
    const rawBE = safeDiv(fixedMonthlyCosts, contributionPerCustomer);
    if (rawBE !== null) {
      breakEvenCustomers = Math.ceil(rawBE);
      breakEvenRevenue = round2(breakEvenCustomers * avgPrice);
    }
  }

  // Operating profit
  const monthlyOperatingProfit = round2(grossProfit - fixedMonthlyCosts);
  const alreadyProfitable = monthlyOperatingProfit >= 0;

  // Cash
  const initialCash = round2(startingCapital - launchCosts);
  const negativeInitialCash = initialCash < 0;

  // Cash runway
  let cashRunwayMonths: number | null = null;
  if (alreadyProfitable) {
    cashRunwayMonths = null; // no constraint
  } else if (negativeInitialCash) {
    cashRunwayMonths = 0;
  } else {
    const monthlyLoss = Math.abs(monthlyOperatingProfit);
    cashRunwayMonths =
      monthlyLoss > 0 ? round2(initialCash / monthlyLoss) : null;
  }

  // Break-even month (when monthly customers will cross break-even customers)
  let breakEvenMonth: number | null = null;
  if (alreadyProfitable && monthlyCustomers >= (breakEvenCustomers ?? 0)) {
    breakEvenMonth = 1;
  } else if (canBreakEven && breakEvenCustomers !== null) {
    const growthRate = 1 + inputs.monthlyGrowthPct / 100;
    if (growthRate > 1) {
      let cumulativeCustomers = monthlyCustomers;
      for (let m = 1; m <= 60; m++) {
        if (cumulativeCustomers >= breakEvenCustomers) {
          breakEvenMonth = m;
          break;
        }
        cumulativeCustomers = cumulativeCustomers * growthRate * (1 - inputs.churnPct / 100);
      }
    } else {
      // No growth – can only be profitable if already is
      breakEvenMonth = monthlyCustomers >= breakEvenCustomers ? 1 : null;
    }
  }

  return {
    monthlyRevenue,
    variableCosts,
    grossProfit,
    grossMarginPct,
    contributionPerCustomer,
    breakEvenCustomers,
    breakEvenRevenue,
    monthlyOperatingProfit,
    initialCash,
    cashRunwayMonths,
    breakEvenMonth,
    canBreakEven,
    alreadyProfitable,
    negativeInitialCash,
  };
}

// ─── Monthly projection (12 months) ───────────────────────────────────────────
export function buildMonthlyProjection(
  inputs: BusinessInputs,
  months = 12
): MonthlyProjectionRow[] {
  const rows: MonthlyProjectionRow[] = [];
  const growthRate = 1 + inputs.monthlyGrowthPct / 100;
  const churnRate = 1 - inputs.churnPct / 100;
  let customers = inputs.monthlyCustomers;
  let cumulativeCash = inputs.startingCapital - inputs.launchCosts;

  for (let m = 1; m <= months; m++) {
    const revenue = round2(inputs.avgPrice * customers);
    const varCosts = round2(inputs.variableCostPerCustomer * customers);
    const operatingProfit = round2(revenue - varCosts - inputs.fixedMonthlyCosts);
    cumulativeCash = round2(cumulativeCash + operatingProfit);

    rows.push({
      month: m,
      customers: Math.round(customers),
      revenue,
      costs: round2(varCosts + inputs.fixedMonthlyCosts),
      operatingProfit,
      cumulativeCash,
    });

    customers = customers * growthRate * churnRate;
  }

  return rows;
}
