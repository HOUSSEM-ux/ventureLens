import type { BusinessInputs, AnalysisResult } from './types';

const STORAGE_KEY = 'venturelens_analysis';

export function saveToStorage(inputs: BusinessInputs, result: AnalysisResult): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ inputs, result, savedAt: new Date().toISOString() })
    );
  } catch {
    // localStorage unavailable (SSR / private mode) — fail silently
  }
}

export function loadFromStorage(): { inputs: BusinessInputs; result: AnalysisResult } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
