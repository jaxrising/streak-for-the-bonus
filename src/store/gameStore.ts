import { create } from 'zustand';
import type { ActivePick, PickRecord, PickSide, Offering } from '../types';
import { offerings } from '../data/offerings';

interface GameState {
  activePick: ActivePick | null;
  weeklyStreak: number;
  weeklyWins: number;
  allTimeWins: number;
  pickHistory: PickRecord[];
  espnLinked: boolean;
  dkLinked: boolean;
  resolving: boolean;
  lastResult: 'won' | 'lost' | null;

  makePick: (offering: Offering, side: PickSide) => void;
  resolvePick: (won: boolean) => void;
  clearResult: () => void;
  resetWeek: () => void;
  resetDemo: () => void;
  linkESPN: () => void;
  linkDK: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  activePick: null,
  weeklyStreak: 3,
  weeklyWins: 3,
  allTimeWins: 12,
  pickHistory: [
    {
      id: 'history-1',
      offeringId: 'nba-1',
      question: 'Which team scores more points?',
      sport: 'NBA',
      chosenOption: 'Boston Celtics',
      side: 'A',
      status: 'won',
      timestamp: Date.now() - 86400000 * 2,
    },
    {
      id: 'history-2',
      offeringId: 'nfl-1',
      question: 'Who wins Sunday Night Football?',
      sport: 'NFL',
      chosenOption: 'Kansas City Chiefs',
      side: 'A',
      status: 'won',
      timestamp: Date.now() - 86400000,
    },
    {
      id: 'history-3',
      offeringId: 'nhl-1',
      question: 'Who wins on the ice tonight?',
      sport: 'NHL',
      chosenOption: 'Toronto Maple Leafs',
      side: 'A',
      status: 'won',
      timestamp: Date.now() - 43200000,
    },
  ],
  espnLinked: false,
  dkLinked: false,
  resolving: false,
  lastResult: null,

  makePick: (offering, side) => {
    const state = get();
    if (state.activePick || state.resolving) return;

    const chosenOption = side === 'A' ? offering.optionA : offering.optionB;
    set({
      activePick: {
        offeringId: offering.id,
        side,
        chosenOption,
        startedAt: Date.now(),
      },
    });
  },

  resolvePick: (won) => {
    const state = get();
    if (!state.activePick) return;

    const offering = offerings.find((o) => o.id === state.activePick!.offeringId);
    const record: PickRecord = {
      id: `pick-${Date.now()}`,
      offeringId: state.activePick.offeringId,
      question: offering?.question ?? '',
      sport: offering?.sport ?? 'NFL',
      chosenOption: state.activePick.chosenOption,
      side: state.activePick.side,
      status: won ? 'won' : 'lost',
      timestamp: Date.now(),
    };

    set({
      activePick: null,
      resolving: true,
      lastResult: won ? 'won' : 'lost',
      weeklyStreak: won ? state.weeklyStreak + 1 : 0,
      weeklyWins: won ? state.weeklyWins + 1 : state.weeklyWins,
      allTimeWins: won ? state.allTimeWins + 1 : state.allTimeWins,
      pickHistory: [record, ...state.pickHistory],
    });
  },

  clearResult: () => {
    set({ resolving: false, lastResult: null });
  },

  resetWeek: () => {
    set({ weeklyStreak: 0, weeklyWins: 0 });
  },

  resetDemo: () => {
    set({
      activePick: null,
      weeklyStreak: 3,
      weeklyWins: 3,
      allTimeWins: 12,
      pickHistory: [
        {
          id: 'history-1',
          offeringId: 'nba-1',
          question: 'Which team scores more points?',
          sport: 'NBA',
          chosenOption: 'Boston Celtics',
          side: 'A',
          status: 'won',
          timestamp: Date.now() - 86400000 * 2,
        },
        {
          id: 'history-2',
          offeringId: 'nfl-1',
          question: 'Who wins Sunday Night Football?',
          sport: 'NFL',
          chosenOption: 'Kansas City Chiefs',
          side: 'A',
          status: 'won',
          timestamp: Date.now() - 86400000,
        },
        {
          id: 'history-3',
          offeringId: 'nhl-1',
          question: 'Who wins on the ice tonight?',
          sport: 'NHL',
          chosenOption: 'Toronto Maple Leafs',
          side: 'A',
          status: 'won',
          timestamp: Date.now() - 43200000,
        },
      ],
      espnLinked: false,
      dkLinked: false,
      resolving: false,
      lastResult: null,
    });
  },

  linkESPN: () => set({ espnLinked: true }),
  linkDK: () => set({ dkLinked: true }),
}));
