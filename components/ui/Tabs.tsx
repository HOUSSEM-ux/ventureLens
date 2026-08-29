'use client';
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-bg-elevated rounded-xl border border-white/8" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`tab-panel-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            text-sm font-medium transition-all duration-200 cursor-pointer
            ${activeTab === tab.id
              ? 'bg-gold text-bg-base shadow-sm'
              : 'text-text-muted hover:text-text-primary hover:bg-white/5'
            }
          `}
        >
          {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
          <span>{tab.label}</span>
          {tab.badge && (
            <span className={`
              text-xs px-1.5 py-0.5 rounded-full font-semibold
              ${activeTab === tab.id ? 'bg-bg-base/20 text-bg-base' : 'bg-white/10 text-text-muted'}
            `}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
