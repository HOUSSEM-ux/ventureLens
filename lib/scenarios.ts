import type { BusinessInputs, ScenarioResult, ScenarioLabel } from './types';
import { calculateMetrics } from './calculations';

interface ScenarioConfig {
  label: ScenarioLabel;
  customerMultiplier: number;
  growthMultiplier: number;
  costMultiplier: number;
}

const SCENARIO_CONFIGS: ScenarioConfig[] = [
  { label: 'Conservative', customerMultiplier: 0.6, growthMultiplier: 0.5, costMultiplier: 1.2 },
  { label: 'Base Case',    customerMultiplier: 1.0, growthMultiplier: 1.0, costMultiplier: 1.0 },
  { label: 'Optimistic',   customerMultiplier: 1.4, growthMultiplier: 1.5, costMultiplier: 0.9 },
];

export function generateScenarios(base: BusinessInputs): ScenarioResult[] {
  return SCENARIO_CONFIGS.map((config) => {
    const scenarioInputs: BusinessInputs = {
      ...base,
      monthlyCustomers: Math.round(base.monthlyCustomers * config.customerMultiplier),
      monthlyGrowthPct: base.monthlyGrowthPct * config.growthMultiplier,
      variableCostPerCustomer:
        base.variableCostPerCustomer * config.costMultiplier,
      fixedMonthlyCosts: base.fixedMonthlyCosts * config.costMultiplier,
    };

    return {
      label: config.label,
      customerMultiplier: config.customerMultiplier,
      growthMultiplier: config.growthMultiplier,
      costMultiplier: config.costMultiplier,
      inputs: scenarioInputs,
      metrics: calculateMetrics(scenarioInputs),
    };
  });
}
