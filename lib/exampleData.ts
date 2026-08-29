import type { BusinessInputs } from './types';

export const EXAMPLE_DATA: BusinessInputs = {
  businessName: 'FreshBox',
  description:
    'A weekly meal-kit subscription for busy urban professionals. Customers receive pre-portioned, chef-designed ingredients delivered to their door.',
  currency: 'USD',
  avgPrice: 20,
  monthlyCustomers: 100,
  monthlyGrowthPct: 10,
  variableCostPerCustomer: 7,
  fixedMonthlyCosts: 800,
  startingCapital: 5000,
  launchCosts: 500,
  churnPct: 5,
};
