import type { RewardTier, Achievement } from '../types';

export const winsRewardTiers: RewardTier[] = [
  {
    id: 'wins-1',
    type: 'wins',
    threshold: 3,
    title: 'Hot Picker',
    description: 'Win 3 picks in a week',
    prize: '$5 Bonus Bet',
    prizeValue: 5,
    icon: 'score',
  },
  {
    id: 'wins-2',
    type: 'wins',
    threshold: 5,
    title: 'On Fire',
    description: 'Win 5 picks in a week',
    prize: '$10 Bonus Bet',
    prizeValue: 10,
    icon: 'coin',
  },
  {
    id: 'wins-3',
    type: 'wins',
    threshold: 7,
    title: 'Untouchable',
    description: 'Win 7 picks in a week',
    prize: '$25 Bonus Bet',
    prizeValue: 25,
    icon: 'trophy',
  },
];

export const streakRewardTiers: RewardTier[] = [
  {
    id: 'streak-1',
    type: 'streak',
    threshold: 3,
    title: '3-Win Streak',
    description: 'Hit a 3-win streak',
    prize: '$5 Bonus Bet',
    prizeValue: 5,
    icon: 'fire-flame',
  },
  {
    id: 'streak-2',
    type: 'streak',
    threshold: 5,
    title: '5-Win Streak',
    description: 'Hit a 5-win streak',
    prize: '$10 Bonus Bet',
    prizeValue: 10,
    icon: 'bolt',
  },
  {
    id: 'streak-3',
    type: 'streak',
    threshold: 7,
    title: '7-Win Streak',
    description: 'Hit a 7-win streak',
    prize: '$25 Bonus Bet',
    prizeValue: 25,
    icon: 'diamond',
  },
];

export const rewardTiers: RewardTier[] = [...winsRewardTiers, ...streakRewardTiers];

export function getUnlockedRewards(weeklyWins: number, weeklyStreak: number) {
  const unlocked = rewardTiers.filter((t) =>
    t.type === 'streak' ? weeklyStreak >= t.threshold : weeklyWins >= t.threshold
  );
  const totalBonusBets = unlocked.reduce((sum, t) => sum + t.prizeValue, 0);
  return { unlocked, totalBonusBets };
}

export function getNextReward(weeklyWins: number, weeklyStreak: number, type: 'streak' | 'wins') {
  const tiers = type === 'streak' ? streakRewardTiers : winsRewardTiers;
  const current = type === 'streak' ? weeklyStreak : weeklyWins;
  const next = tiers.find((t) => current < t.threshold);
  if (!next) return null;
  const gap = next.threshold - current;
  const gapText = type === 'streak' ? `${gap} more in a row` : `${gap} more win${gap !== 1 ? 's' : ''}`;
  return { tier: next, gap, gapText };
}

export function getHighestUnlocked(weeklyWins: number, weeklyStreak: number, type: 'streak' | 'wins') {
  const tiers = type === 'streak' ? streakRewardTiers : winsRewardTiers;
  const current = type === 'streak' ? weeklyStreak : weeklyWins;
  const unlocked = tiers.filter((t) => current >= t.threshold);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

export const achievements: Achievement[] = [
  {
    id: 'first-pick',
    title: 'First Pick',
    description: 'Make your first pick',
    icon: 'score',
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 1,
  },
  {
    id: 'hot-streak-3',
    title: 'Hot Streak',
    description: 'Reach a 3-win streak',
    icon: 'fire-flame',
    earned: false,
    condition: (_w, streak) => streak >= 3,
  },
  {
    id: 'five-timer',
    title: 'Five Timer',
    description: 'Win 5 picks in a single week',
    icon: 'star',
    earned: false,
    condition: (weekly) => weekly >= 5,
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Win 7 picks in a single week',
    icon: 'trophy',
    earned: false,
    condition: (weekly) => weekly >= 7,
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: 'Win 10 all-time picks',
    icon: 'olympic-medal',
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 10,
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Win 25 all-time picks',
    icon: 'trophy',
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 25,
  },
];
