import type { Offering, PickSide } from '../types';

const UPSET_BOOST = 0.05;

export function parseAmericanOdds(odds: string): number {
  const num = parseInt(odds, 10);
  if (num > 0) {
    return 100 / (num + 100);
  }
  return Math.abs(num) / (Math.abs(num) + 100);
}

export function resolveOutcome(offering: Offering, side: PickSide): boolean {
  const odds = side === 'A' ? offering.oddsA : offering.oddsB;
  if (!odds) return Math.random() < 0.5;

  let winProb = parseAmericanOdds(odds);

  if (winProb < 0.5) {
    winProb += UPSET_BOOST;
  }

  return Math.random() < winProb;
}

export function getResolveDelay(offering: Offering): number {
  const match = offering.startTime.match(/^(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 5000;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const gameMinutes = hours * 60 + minutes;
  const seed = (gameMinutes * 7 + 13) % 100;
  const delay = 4000 + seed * 40;

  return delay;
}

export const RESOLVE_DELAY_MS = 5000;
export const RESULT_DISPLAY_MS = 2500;
