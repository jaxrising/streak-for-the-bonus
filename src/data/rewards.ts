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

const BASE = import.meta.env.BASE_URL;

export const achievements: Achievement[] = [
  {
    id: 'tapped-in',
    title: 'Tapped In',
    description: 'Make your first pick',
    icon: 'score',
    badgeImage: `${BASE}badge-tapped-in.png`,
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 1,
  },
  {
    id: 'on-fire',
    title: 'On Fire',
    description: 'Reach a 3-win streak',
    icon: 'fire-flame',
    badgeImage: `${BASE}badge-on-fire.png`,
    earned: false,
    condition: (_w, streak) => streak >= 3,
  },
  {
    id: 'points-savage',
    title: 'Points Savage',
    description: 'Win 5 picks in a single week',
    icon: 'star',
    badgeImage: `${BASE}badge-points-savage.png`,
    earned: false,
    condition: (weekly) => weekly >= 5,
  },
  {
    id: 'no-mercy',
    title: 'No Mercy',
    description: 'Win 7 picks in a single week',
    icon: 'trophy',
    badgeImage: `${BASE}badge-no-mercy.png`,
    earned: false,
    condition: (weekly) => weekly >= 7,
  },
  {
    id: 'the-negotiator',
    title: 'The Negotiator',
    description: 'Win 10 all-time picks',
    icon: 'olympic-medal',
    badgeImage: `${BASE}badge-the-negotiator.png`,
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 10,
  },
  {
    id: 'fortune-teller',
    title: 'Fortune Teller',
    description: 'Win 3 underdogs in a row',
    icon: 'crystal-ball',
    badgeImage: `${BASE}badge-fortune-teller.png`,
    earned: false,
    condition: (_w, streak) => streak >= 5,
  },
  {
    id: 'steamrolled',
    title: 'Steamrolled',
    description: 'Win 15 all-time picks',
    icon: 'bolt',
    badgeImage: `${BASE}badge-steamrolled.png`,
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 15,
  },
  {
    id: 'the-commish',
    title: 'The Commish',
    description: 'Win 20 all-time picks',
    icon: 'trophy',
    badgeImage: `${BASE}badge-the-commish.png`,
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 20,
  },
  {
    id: 'miracle-maker',
    title: 'Miracle Maker',
    description: 'Win 25 all-time picks',
    icon: 'diamond',
    badgeImage: `${BASE}badge-miracle-maker.png`,
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 25,
  },
  {
    id: 'ice-cold',
    title: 'Ice Cold',
    description: 'Reach a 7-win streak',
    icon: 'bolt',
    badgeImage: `${BASE}badge-ice-cold.png`,
    earned: false,
    condition: (_w, streak) => streak >= 7,
  },
  {
    id: 'top-dog',
    title: 'Top Dog',
    description: 'Win 50 all-time picks',
    icon: 'trophy',
    badgeImage: `${BASE}badge-top-dog.png`,
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 50,
  },
  {
    id: 'never-took-an-l',
    title: 'Never Took an L',
    description: 'Win 10 picks in a single week',
    icon: 'star',
    badgeImage: `${BASE}badge-never-took-an-l.png`,
    earned: false,
    condition: (weekly) => weekly >= 10,
  },
];
