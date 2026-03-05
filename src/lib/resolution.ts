const WIN_RATE = 0.55;

export function resolveOutcome(): boolean {
  return Math.random() < WIN_RATE;
}

export const RESOLVE_DELAY_MS = 5000;
export const RESULT_DISPLAY_MS = 2500;
