export type Sport = 'NFL' | 'NBA' | 'NHL' | 'MLB' | 'Soccer' | 'Golf';

export interface Offering {
  id: string;
  sport: Sport;
  league: string;
  question: string;
  optionA: string;
  optionB: string;
  shortA?: string;
  shortB?: string;
  abbrA?: string;
  abbrB?: string;
  imageA?: string;
  imageB?: string;
  colorA?: string;
  colorB?: string;
  watermarkA?: string;
  watermarkB?: string;
  oddsA?: string;
  oddsB?: string;
  startTime: string;
  confidence?: number;
}

export type PickSide = 'A' | 'B';
export type PickStatus = 'pending' | 'won' | 'lost';

export interface ActivePick {
  offeringId: string;
  side: PickSide;
  chosenOption: string;
  startedAt: number;
}

export interface PickRecord {
  id: string;
  offeringId: string;
  question: string;
  sport: Sport;
  chosenOption: string;
  side: PickSide;
  status: PickStatus;
  timestamp: number;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  dailyWins: number;
  weeklyStreak: number;
  weeklyWins: number;
  allTimeWins: number;
  isCurrentUser?: boolean;
}

export interface RewardTier {
  id: string;
  type: 'streak' | 'wins';
  threshold: number;
  title: string;
  description: string;
  prize: string;
  prizeValue: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  condition: (weeklyWins: number, weeklyStreak: number, allTimeWins: number) => boolean;
}
