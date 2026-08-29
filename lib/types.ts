// ─── Currency ─────────────────────────────────────────────────────────────────
export type Currency = 'USD' | 'EUR' | 'GBP' | 'TND';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  TND: 'TND',
};

// ─── Raw user input ────────────────────────────────────────────────────────────
export interface BusinessInputs {
  businessName: string;
  description: string;
  currency: Currency;
  avgPrice: number;
  monthlyCustomers: number;
  monthlyGrowthPct: number;
  variableCostPerCustomer: number;
  fixedMonthlyCosts: number;
  startingCapital: number;
  launchCosts: number;
  churnPct: number;
}

// ─── Computed financial metrics ────────────────────────────────────────────────
export interface FinancialMetrics {
  monthlyRevenue: number;
  variableCosts: number;
  grossProfit: number;
  grossMarginPct: number | null;
  contributionPerCustomer: number;
  breakEvenCustomers: number | null;
  breakEvenRevenue: number | null;
  monthlyOperatingProfit: number;
  initialCash: number;
  cashRunwayMonths: number | null;
  breakEvenMonth: number | null;
  canBreakEven: boolean;
  alreadyProfitable: boolean;
  negativeInitialCash: boolean;
}

// ─── Scenario ──────────────────────────────────────────────────────────────────
export type ScenarioLabel = 'Conservative' | 'Base Case' | 'Optimistic';

export interface ScenarioResult {
  label: ScenarioLabel;
  customerMultiplier: number;
  growthMultiplier: number;
  costMultiplier: number;
  inputs: BusinessInputs;
  metrics: FinancialMetrics;
}

// ─── Risk ──────────────────────────────────────────────────────────────────────
export type RiskSeverity = 'high' | 'medium' | 'low';

export interface Risk {
  id: string;
  title: string;
  severity: RiskSeverity;
  assumption: string;
  action: string;
  minEvidence: string;
  passFail: string;
  estimatedTime: string;
}

// ─── Monthly projection row ────────────────────────────────────────────────────
export interface MonthlyProjectionRow {
  month: number;
  customers: number;
  revenue: number;
  costs: number;
  operatingProfit: number;
  cumulativeCash: number;
}

// ─── Overall status ────────────────────────────────────────────────────────────
export type OverallStatus = 'Promising' | 'Needs Validation' | 'High Risk';

// ─── Full analysis result ──────────────────────────────────────────────────────
export interface AnalysisResult {
  inputs: BusinessInputs;
  metrics: FinancialMetrics;
  scenarios: ScenarioResult[];
  risks: Risk[];
  overallStatus: OverallStatus;
  monthlyProjection: MonthlyProjectionRow[];
}

// ─── Step state ────────────────────────────────────────────────────────────────
export type AppStep = 'landing' | 'form' | 'results' | 'report';
