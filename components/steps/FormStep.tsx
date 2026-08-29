'use client';
import React, { useState, useEffect } from 'react';
import type { BusinessInputs } from '@/lib/types';
import { InputField } from '@/components/form/InputField';
import { CurrencySelector } from '@/components/form/CurrencySelector';
import { Button } from '@/components/ui/Button';
import { CURRENCY_SYMBOLS } from '@/lib/format';

interface FormStepProps {
  initialInputs: BusinessInputs;
  onAnalyze: (inputs: BusinessInputs) => void;
  onLoadExample: () => void;
}

interface FormErrors {
  [key: string]: string;
}

function validateInputs(inputs: BusinessInputs): FormErrors {
  const errors: FormErrors = {};
  if (!inputs.businessName.trim()) errors.businessName = 'Please enter your business name.';
  if (inputs.avgPrice <= 0) errors.avgPrice = 'Selling price must be greater than zero.';
  if (inputs.monthlyCustomers < 1) errors.monthlyCustomers = 'You need at least 1 expected customer.';
  if (inputs.monthlyGrowthPct < 0) errors.monthlyGrowthPct = 'Growth cannot be negative.';
  if (inputs.variableCostPerCustomer < 0) errors.variableCostPerCustomer = 'Variable cost cannot be negative.';
  if (inputs.fixedMonthlyCosts < 0) errors.fixedMonthlyCosts = 'Fixed costs cannot be negative.';
  if (inputs.startingCapital < 0) errors.startingCapital = 'Starting capital cannot be negative.';
  if (inputs.launchCosts < 0) errors.launchCosts = 'Launch costs cannot be negative.';
  if (inputs.churnPct < 0 || inputs.churnPct > 100) errors.churnPct = 'Churn must be between 0 and 100.';
  return errors;
}

export function FormStep({ initialInputs, onAnalyze, onLoadExample }: FormStepProps) {
  const [inputs, setInputs] = useState<BusinessInputs>(initialInputs);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const sym = CURRENCY_SYMBOLS[inputs.currency];

  // Sync when parent loads example
  useEffect(() => {
    setInputs(initialInputs);
  }, [initialInputs]);

  function set(key: keyof BusinessInputs, raw: string) {
    const numericKeys: (keyof BusinessInputs)[] = [
      'avgPrice', 'monthlyCustomers', 'monthlyGrowthPct',
      'variableCostPerCustomer', 'fixedMonthlyCosts',
      'startingCapital', 'launchCosts', 'churnPct',
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any = numericKeys.includes(key)
      ? (raw === '' ? 0 : parseFloat(raw) || 0)
      : raw;
    setInputs((prev) => ({ ...prev, [key]: value }));
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateInputs(inputs);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onAnalyze(inputs);
    } else {
      // Scroll to first error
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.focus();
    }
  }

  function handleLoadExample() {
    onLoadExample();
    setErrors({});
    setSubmitted(false);
  }

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-4 pt-2">{children}</h3>
  );

  const Divider = () => <div className="border-t border-white/8 my-6" />;

  return (
    <div className="animate-slide-up max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Your Business Assumptions</h2>
        <p className="text-text-muted text-sm">
          Fill in what you know — estimates are fine. Every field has a short explanation.
        </p>
      </div>

      {/* Example loader */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gold/20 bg-gold/5 mb-8">
        <svg className="w-5 h-5 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-primary font-medium">Load a worked example</p>
          <p className="text-xs text-text-muted">See how VentureLens works with a meal-kit subscription business.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleLoadExample}>
          Load example
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 */}
        <SectionTitle>Business overview</SectionTitle>
        <div className="grid grid-cols-1 gap-5">
          <InputField
            id="businessName"
            label="Business name"
            helper="What is your venture called? This will appear in the report."
            placeholder="e.g. FreshBox"
            value={inputs.businessName}
            onChange={(v) => set('businessName', v)}
            error={errors.businessName}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-text-primary">
              Short description
            </label>
            <p className="text-xs text-text-muted -mt-1">One or two sentences about what the business does and who it serves.</p>
            <textarea
              id="description"
              rows={2}
              value={inputs.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="e.g. A weekly meal-kit subscription for busy professionals..."
              className="bg-bg-elevated border border-white/10 focus:border-gold/50 rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-faint focus:outline-none transition-colors resize-none"
            />
          </div>
          <CurrencySelector
            value={inputs.currency}
            onChange={(v) => set('currency', v)}
          />
        </div>

        <Divider />

        {/* Section 2 */}
        <SectionTitle>Revenue assumptions</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            id="avgPrice"
            label="Average selling price per customer"
            helper="How much does one customer pay per month? Include tax if applicable."
            type="number"
            prefix={sym}
            placeholder="e.g. 20"
            value={inputs.avgPrice || ''}
            onChange={(v) => set('avgPrice', v)}
            error={errors.avgPrice}
            min={0}
            step={0.01}
            required
          />
          <InputField
            id="monthlyCustomers"
            label="Expected customers in month 1"
            helper="Your realistic estimate — not a best-case. Be conservative."
            type="number"
            placeholder="e.g. 100"
            value={inputs.monthlyCustomers || ''}
            onChange={(v) => set('monthlyCustomers', v)}
            error={errors.monthlyCustomers}
            min={0}
            step={1}
            required
          />
          <InputField
            id="monthlyGrowthPct"
            label="Monthly customer growth"
            helper="How much do you expect your customer base to grow each month?"
            type="number"
            suffix="%"
            placeholder="e.g. 10"
            value={inputs.monthlyGrowthPct || ''}
            onChange={(v) => set('monthlyGrowthPct', v)}
            error={errors.monthlyGrowthPct}
            min={0}
            max={200}
            step={0.1}
          />
          <InputField
            id="churnPct"
            label="Monthly customer churn"
            helper="Percentage of customers who stop buying each month. Enter 0 if not relevant."
            type="number"
            suffix="%"
            placeholder="e.g. 5"
            value={inputs.churnPct || ''}
            onChange={(v) => set('churnPct', v)}
            error={errors.churnPct}
            min={0}
            max={100}
            step={0.1}
          />
        </div>

        <Divider />

        {/* Section 3 */}
        <SectionTitle>Cost structure</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            id="variableCostPerCustomer"
            label="Variable cost per customer"
            helper="What does it cost you to serve one customer? Include materials, delivery, commissions, etc."
            type="number"
            prefix={sym}
            placeholder="e.g. 7"
            value={inputs.variableCostPerCustomer || ''}
            onChange={(v) => set('variableCostPerCustomer', v)}
            error={errors.variableCostPerCustomer}
            min={0}
            step={0.01}
          />
          <InputField
            id="fixedMonthlyCosts"
            label="Fixed monthly costs"
            helper="Costs that stay the same regardless of customers: rent, salaries, subscriptions, etc."
            type="number"
            prefix={sym}
            placeholder="e.g. 800"
            value={inputs.fixedMonthlyCosts || ''}
            onChange={(v) => set('fixedMonthlyCosts', v)}
            error={errors.fixedMonthlyCosts}
            min={0}
            step={1}
          />
        </div>

        <Divider />

        {/* Section 4 */}
        <SectionTitle>Capital & launch</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            id="startingCapital"
            label="Starting capital"
            helper="Total money available to start the business — savings, investment, or loan."
            type="number"
            prefix={sym}
            placeholder="e.g. 5000"
            value={inputs.startingCapital || ''}
            onChange={(v) => set('startingCapital', v)}
            error={errors.startingCapital}
            min={0}
            step={1}
          />
          <InputField
            id="launchCosts"
            label="One-time launch costs"
            helper="Costs paid once to start: website, equipment, licenses, branding, initial stock."
            type="number"
            prefix={sym}
            placeholder="e.g. 500"
            value={inputs.launchCosts || ''}
            onChange={(v) => set('launchCosts', v)}
            error={errors.launchCosts}
            min={0}
            step={1}
          />
        </div>

        {/* Validation summary */}
        {submitted && Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 rounded-xl border border-danger/30 bg-danger/5" role="alert">
            <p className="text-sm text-danger font-medium">
              Please fix {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} above before continuing.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Button type="submit" size="lg" id="analyze-btn">
            Analyse my idea
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}
