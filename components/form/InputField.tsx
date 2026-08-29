'use client';
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  type?: 'text' | 'number';
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export function InputField({
  id,
  label,
  helper,
  error,
  prefix,
  suffix,
  type = 'text',
  placeholder,
  value,
  onChange,
  min,
  max,
  step,
  required,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-primary flex items-center gap-1">
        {label}
        {required && <span className="text-gold text-xs">*</span>}
      </label>
      {helper && <p className="text-xs text-text-muted leading-relaxed -mt-1">{helper}</p>}
      <div className={`
        relative flex items-center rounded-xl border transition-colors
        bg-bg-elevated
        ${error
          ? 'border-danger/50 focus-within:border-danger'
          : 'border-white/10 focus-within:border-gold/50'
        }
      `}>
        {prefix && (
          <span className="pl-3 pr-1 text-sm text-text-muted font-medium flex-shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
          aria-invalid={!!error}
          className={`
            flex-1 bg-transparent py-2.5 text-sm text-text-primary placeholder:text-text-faint
            focus:outline-none min-w-0
            ${prefix ? 'pl-1' : 'pl-3'}
            ${suffix ? 'pr-1' : 'pr-3'}
          `}
        />
        {suffix && (
          <span className="pr-3 pl-1 text-sm text-text-muted font-medium flex-shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
