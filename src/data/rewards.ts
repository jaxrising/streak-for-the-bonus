import type { RewardTier, Achievement } from '../types';

export const rewardTiers: RewardTier[] = [
  {
    id: 'tier-1',
    threshold: 3,
    title: 'Hot Streak',
    description: 'Win 3 picks in a week',
    prize: '$5 DraftKings Free Bet',
    icon: '🔥',
  },
  {
    id: 'tier-2',
    threshold: 5,
    title: 'On Fire',
    description: 'Win 5 picks in a week',
    prize: '$10 DraftKings Free Bet',
    icon: '💰',
  },
  {
    id: 'tier-3',
    threshold: 7,
    title: 'Untouchable',
    description: 'Win 7 picks in a week',
    prize: '$25 DraftKings Free Bet + Bonus Entry',
    icon: '👑',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'first-pick',
    title: 'First Pick',
    description: 'Make your first pick',
    icon: '🎯',
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 1,
  },
  {
    id: 'hot-streak-3',
    title: 'Hot Streak',
    description: 'Reach a 3-win streak',
    icon: '🔥',
    earned: false,
    condition: (_w, streak) => streak >= 3,
  },
  {
    id: 'five-timer',
    title: 'Five Timer',
    description: 'Win 5 picks in a single week',
    icon: '🖐️',
    earned: false,
    condition: (weekly) => weekly >= 5,
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Win 7 picks in a single week',
    icon: '👑',
    earned: false,
    condition: (weekly) => weekly >= 7,
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: 'Win 10 all-time picks',
    icon: '🎖️',
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 10,
  },
  {
    id: 'legend',
    title: 'Legend',
    description: 'Win 25 all-time picks',
    icon: '🏆',
    earned: false,
    condition: (_w, _s, allTime) => allTime >= 25,
  },
];
