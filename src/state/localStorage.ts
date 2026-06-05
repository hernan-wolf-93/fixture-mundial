import type { AppState } from '../types';

const STORAGE_KEY = 'fixture-mundial-state';

export function saveState(state: AppState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    console.warn('Failed to save state to localStorage');
  }
}

export function loadState(): AppState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as AppState;
  } catch {
    console.warn('Failed to load state from localStorage');
    return null;
  }
}

