'use client';
import React from 'react';
import { Button } from '@/components/ui/Button';

interface LandingStepProps {
  onStart: () => void;
  hasExisting: boolean;
  onResumeExisting: () => void;
}

const VALUE_PROPS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Understand your numbers',
    body: 'Revenue, gross margin, break-even customers, and cash runway — calculated instantly from your assumptions.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    title: 'Stress-test your assumptions',
    body: 'Three scenarios — conservative, base, and optimistic — show you how sensitive your idea is to reality.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: 'Know what to validate next',
    body: 'Pinpoint your riskiest assumptions and get a concrete experiment to run this week — before spending money.',
  },
];

export function LandingStep({ onStart, hasExisting, onResumeExisting }: LandingStepProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div className="text-center pt-8 pb-16 max-w-3xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Free · No account required · Browser-only
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          Is your business idea
          <br />
          <span className="gradient-text">financially viable?</span>
        </h1>

        <p className="text-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          Enter your assumptions. VentureLens calculates break-even, cash runway,
          and scenario outcomes — then tells you exactly what to validate next.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={onStart} id="cta-test-idea">
            Test my idea
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Button>
          {hasExisting && (
            <Button variant="ghost" size="lg" onClick={onResumeExisting}>
              Resume last analysis
            </Button>
          )}
        </div>
      </div>

      {/* Value propositions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
        {VALUE_PROPS.map((vp, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-bg-surface p-6 hover:border-gold/25 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:bg-gold/15 transition-colors">
              {vp.icon}
            </div>
            <h2 className="font-semibold text-text-primary mb-2">{vp.title}</h2>
            <p className="text-sm text-text-muted leading-relaxed">{vp.body}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-8">How it works</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { num: '01', label: 'Enter your idea and assumptions' },
            { num: '02', label: 'Get your financial model instantly' },
            { num: '03', label: 'Review conservative to optimistic scenarios' },
            { num: '04', label: 'Export a one-page decision report' },
          ].map((item) => (
            <div key={item.num} className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-xs font-bold text-gold">
                {item.num}
              </div>
              <p className="text-xs text-text-muted text-center leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
