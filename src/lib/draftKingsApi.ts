import type { Offering, Sport } from '../types';
import { offerings as staticOfferings } from '../data/offerings';

const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

const SPORT_PATHS: { sport: Sport; league: string; path: string }[] = [
  { sport: 'NFL', league: 'NFL', path: 'football/nfl' },
  { sport: 'NBA', league: 'NBA', path: 'basketball/nba' },
  { sport: 'MLB', league: 'MLB', path: 'baseball/mlb' },
  { sport: 'NHL', league: 'NHL', path: 'hockey/nhl' },
  { sport: 'WNBA', league: 'WNBA', path: 'basketball/wnba' },
  { sport: 'Soccer', league: 'EPL', path: 'soccer/eng.1' },
  { sport: 'Soccer', league: 'Champions League', path: 'soccer/uefa.champions' },
  { sport: 'Soccer', league: 'MLS', path: 'soccer/usa.1' },
  { sport: 'Soccer', league: 'La Liga', path: 'soccer/esp.1' },
  { sport: 'Soccer', league: 'Bundesliga', path: 'soccer/ger.1' },
];

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

interface ESPNCompetitor {
  team: {
    abbreviation: string;
    displayName: string;
    shortDisplayName: string;
    logo: string;
    color?: string;
  };
  winner?: boolean;
  score?: string;
}

interface ESPNCompetition {
  id: string;
  status: { type: { completed: boolean; description: string; shortDetail: string } };
  competitors: ESPNCompetitor[];
  odds?: { pointSpread?: { home?: { close?: { line?: string; odds?: string } }; away?: { close?: { line?: string; odds?: string } } }; moneyline?: { home?: { close?: { odds?: string } }; away?: { close?: { odds?: string } } } }[];
  startDate: string;
}

interface ESPNEvent {
  id: string;
  name: string;
  competitions: ESPNCompetition[];
}

interface ESPNScoreboard {
  events: ESPNEvent[];
}

function formatStartTime(isoDate: string): string {
  const d = new Date(isoDate);
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m} ${ampm} ET`;
}

function toDarkLogo(url: string): string {
  return url.replace('/500/', '/500-dark/');
}

function mapESPNToOffering(event: ESPNEvent, sport: Sport, league: string): Offering | null {
  const comp = event.competitions[0];
  if (!comp || comp.competitors.length < 2) return null;
  if (comp.status.type.completed) return null;

  const gameDate = new Date(comp.startDate);
  const now = new Date();
  if (
    gameDate.getFullYear() !== now.getFullYear() ||
    gameDate.getMonth() !== now.getMonth() ||
    gameDate.getDate() !== now.getDate()
  ) {
    return null;
  }

  const odds = comp.odds?.[0];
  if (!odds) return null;

  const home = comp.competitors[0];
  const away = comp.competitors[1];

  const homeSpread = odds?.pointSpread?.home?.close;
  const awaySpread = odds?.pointSpread?.away?.close;

  const pickPctA = Math.floor(35 + Math.random() * 30);

  return {
    id: `espn-${event.id}`,
    sport,
    league,
    question: 'Pick against the spread!',
    optionA: away.team.displayName,
    optionB: home.team.displayName,
    shortA: away.team.shortDisplayName,
    shortB: home.team.shortDisplayName,
    abbrA: away.team.abbreviation,
    abbrB: home.team.abbreviation,
    imageA: toDarkLogo(away.team.logo),
    imageB: toDarkLogo(home.team.logo),
    colorA: away.team.color ? `#${away.team.color}` : '#333333',
    colorB: home.team.color ? `#${home.team.color}` : '#333333',
    oddsA: awaySpread ? `${awaySpread.line} (${awaySpread.odds})` : undefined,
    oddsB: homeSpread ? `${homeSpread.line} (${homeSpread.odds})` : undefined,
    pickPctA,
    pickPctB: 100 - pickPctA,
    startTime: formatStartTime(comp.startDate),
  };
}

async function fetchSportOfferings(sportConfig: typeof SPORT_PATHS[0]): Promise<Offering[]> {
  try {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const url = `${ESPN_BASE}/${sportConfig.path}/scoreboard?dates=${dateStr}`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const data: ESPNScoreboard = await res.json();
    const offerings: Offering[] = [];
    for (const event of data.events) {
      const offering = mapESPNToOffering(event, sportConfig.sport, sportConfig.league);
      if (offering) offerings.push(offering);
    }
    return offerings;
  } catch {
    return [];
  }
}

export async function fetchAllOfferings(): Promise<Offering[]> {
  const results = await Promise.allSettled(
    SPORT_PATHS.map((config) => fetchSportOfferings(config))
  );
  const offerings: Offering[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      offerings.push(...result.value);
    }
  }
  return offerings.length === 0 ? staticOfferings : offerings;
}

let cachedOfferings: Offering[] | null = null;
let lastFetch = 0;

export async function getOfferings(forceRefresh = false): Promise<Offering[]> {
  const now = Date.now();
  if (!forceRefresh && cachedOfferings && now - lastFetch < REFRESH_INTERVAL_MS) {
    return cachedOfferings;
  }
  cachedOfferings = await fetchAllOfferings();
  lastFetch = now;
  return cachedOfferings;
}

export function getCachedOfferings(): Offering[] {
  return cachedOfferings ?? staticOfferings;
}

export { REFRESH_INTERVAL_MS };
