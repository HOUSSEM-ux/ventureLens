'use client';
import React, { useState, useCallback, useEffect } from 'react';
import type { BusinessInputs, AnalysisResult, AppStep } from '@/lib/types';
import { calculateMetrics, buildMonthlyProjection } from '@/lib/calculations';
import { generateScenarios } from '@/lib/scenarios';
import { detectRisks, determineOverallStatus } from '@/lib/risks';
import { saveToStorage, loadFromStorage } from '@/lib/storage';
import { EXAMPLE_DATA } from '@/lib/exampleData';

// Steps
import { LandingStep } from '@/components/steps/LandingStep';
import { FormStep } from '@/components/steps/FormStep';
import { ResultsStep } from '@/components/steps/ResultsStep';
import { ReportStep } from '@/components/steps/ReportStep';

// ── Step Progress Bar ────────────────────────────────────────────────────────
const STEPS: { id: AppStep; label: string; num: number }[] = [
  { id: 'landing', label: 'Start',    num: 1 },
  { id: 'form',    label: 'Inputs',   num: 2 },
  { id: 'results', label: 'Analysis', num: 3 },
  { id: 'report',  label: 'Report',   num: 4 },
];

function StepBar({ current }: { current: AppStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-0 no-print">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  transition-all duration-300
                  ${done
                    ? 'bg-gold text-bg-base'
                    : active
                    ? 'bg-gold/20 border-2 border-gold text-gold'
                    : 'bg-bg-elevated border border-white/15 text-text-faint'
                  }
                `}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : step.num}
              </div>
              <span className={`text-xs ${active ? 'text-gold' : done ? 'text-text-muted' : 'text-text-faint'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-12 sm:w-20 mx-1 mb-4 transition-all duration-500 ${i < currentIndex ? 'bg-gold' : 'bg-white/10'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Main app ─────────────────────────────────────────────────────────────────
function runAnalysis(inputs: BusinessInputs): AnalysisResult {
  const metrics = calculateMetrics(inputs);
  const scenarios = generateScenarios(inputs);
  const risks = detectRisks(inputs, metrics);
  const overallStatus = determineOverallStatus(metrics, risks);
  const monthlyProjection = buildMonthlyProjection(inputs);
  return { inputs, metrics, scenarios, risks, overallStatus, monthlyProjection };
}

const DEFAULT_INPUTS: BusinessInputs = {
  businessName: '',
  description: '',
  currency: 'USD',
  avgPrice: 0,
  monthlyCustomers: 0,
  monthlyGrowthPct: 0,
  variableCostPerCustomer: 0,
  fixedMonthlyCosts: 0,
  startingCapital: 0,
  launchCosts: 0,
  churnPct: 0,
};

export default function App() {
  const [step, setStep] = useState<AppStep>('landing');
  const [inputs, setInputs] = useState<BusinessInputs>(DEFAULT_INPUTS);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage after hydration
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setInputs(saved.inputs);
      setResult(saved.result);
    }
    setHydrated(true);
  }, []);

  const handleStart = useCallback(() => setStep('form'), []);

  const handleLoadExample = useCallback(() => {
    setInputs(EXAMPLE_DATA);
  }, []);

  const handleAnalyze = useCallback(
    (submittedInputs: BusinessInputs) => {
      const analysisResult = runAnalysis(submittedInputs);
      setInputs(submittedInputs);
      setResult(analysisResult);
      saveToStorage(submittedInputs, analysisResult);
      setStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const handleViewReport = useCallback(() => {
    setStep('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback((target: AppStep) => {
    setStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
    setResult(null);
    setStep('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Nav */}
      <header className="no-print sticky top-0 z-40 border-b border-white/8 bg-bg-base/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="VentureLens home"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center">
              <svg className="w-4 h-4 text-bg-base" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <span className="font-bold text-text-primary group-hover:text-gold transition-colors">
              VentureLens
            </span>
          </button>
          {step !== 'landing' && (
            <div className="hidden sm:block">
              <StepBar current={step} />
            </div>
          )}
          <div className="w-24 flex justify-end">
            {step !== 'landing' && (
              <button
                onClick={handleReset}
                className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                Start over
              </button>
            )}
          </div>
        </div>
        {/* Mobile step bar */}
        {step !== 'landing' && (
          <div className="sm:hidden px-4 pb-3">
            <StepBar current={step} />
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {step === 'landing' && (
          <LandingStep
            onStart={handleStart}
            hasExisting={!!result}
            onResumeExisting={() => result && setStep('results')}
          />
        )}
        {step === 'form' && (
          <FormStep
            initialInputs={inputs}
            onAnalyze={handleAnalyze}
            onLoadExample={handleLoadExample}
          />
        )}
        {step === 'results' && result && (
          <ResultsStep
            result={result}
            onViewReport={handleViewReport}
            onBack={() => handleBack('form')}
          />
        )}
        {step === 'report' && result && (
          <ReportStep
            result={result}
            onBack={() => handleBack('results')}
          />
        )}
      </main>

      {/* Disclaimer */}
      <footer className="no-print border-t border-white/8 mt-12 py-6 px-4 sm:px-6">
        <p className="text-center text-xs text-text-faint max-w-2xl mx-auto">
          VentureLens is an educational decision-support tool, not financial or investment advice.
          All projections are estimates based on the assumptions you enter and should not be used as the sole basis for business decisions.
        </p>
      </footer>
    </div>
  );
}
