import { create } from 'zustand';
import type { ActivePick, PickRecord, PickSide, Offering } from '../types';

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

interface PendingSelection {
  offeringId: string;
  side: PickSide;
  chosenOption: string;
  offering: Offering;
}

interface GameState {
  activePick: ActivePick | null;
  pendingSelection: PendingSelection | null;
  submittedPick: { offeringId: string; side: PickSide; chosenOption: string } | null;
  submitted: boolean;
  weeklyStreak: number;
  weeklyWins: number;
  allTimeWins: number;
  pickHistory: PickRecord[];
  espnLinked: boolean;
  dkLinked: boolean;
  uid: string | null;

  selectPick: (offering: Offering, side: PickSide) => void;
  submitPick: () => void;
  makePick: (offering: Offering, side: PickSide) => void;
  resolvePick: (won: boolean) => void;
  resetWeek: () => void;
  resetDemo: () => void;
  linkESPN: () => void;
  linkDK: () => void;
  setUser: (uid: string | null) => void;
  syncFromFirebase: (data: { weeklyStreak: number; weeklyWins: number; allTimeWins: number }) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  activePick: null,
  pendingSelection: null,
  submittedPick: null,
  submitted: false,
  weeklyStreak: 3,
  weeklyWins: 3,
  allTimeWins: 12,
  uid: null,
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

  selectPick: (offering, side) => {
    const state = get();
    if (state.submitted) return;

    if (
      state.pendingSelection?.offeringId === offering.id &&
      state.pendingSelection?.side === side
    ) {
      set({ pendingSelection: null });
      return;
    }

    const chosenOption = side === 'A' ? offering.optionA : offering.optionB;
    set({
      pendingSelection: { offeringId: offering.id, side, chosenOption, offering },
    });
  },

  submitPick: () => {
    const state = get();
    if (!state.pendingSelection || state.submitted) return;

    const { offeringId, side, chosenOption, offering } = state.pendingSelection;
    const pendingRecord: PickRecord = {
      id: `pick-${Date.now()}`,
      offeringId,
      question: offering.question,
      sport: offering.sport,
      chosenOption,
      side,
      status: 'pending',
      timestamp: Date.now(),
    };

    set({
      activePick: {
        offeringId,
        side,
        chosenOption,
        startedAt: Date.now(),
        offering,
      },
      submittedPick: { offeringId, side, chosenOption },
      pendingSelection: null,
      submitted: true,
      pickHistory: [pendingRecord, ...state.pickHistory],
    });

    if (USE_FIREBASE && state.uid) {
      const odds = side === 'A' ? (offering.oddsA ?? '') : (offering.oddsB ?? '');
      import('../firebase/collections').then(({ recordPick }) => {
        recordPick(state.uid!, offeringId, side, chosenOption, odds);
      });
    }
  },

  makePick: (offering, side) => {
    const state = get();
    if (state.activePick) return;

    const chosenOption = side === 'A' ? offering.optionA : offering.optionB;
    const pendingRecord: PickRecord = {
      id: `pick-${Date.now()}`,
      offeringId: offering.id,
      question: offering.question,
      sport: offering.sport,
      chosenOption,
      side,
      status: 'pending',
      timestamp: Date.now(),
    };

    set({
      activePick: {
        offeringId: offering.id,
        side,
        chosenOption,
        startedAt: Date.now(),
        offering,
      },
      pickHistory: [pendingRecord, ...state.pickHistory],
    });

    if (USE_FIREBASE && state.uid) {
      const odds = side === 'A' ? (offering.oddsA ?? '') : (offering.oddsB ?? '');
      import('../firebase/collections').then(({ recordPick }) => {
        recordPick(state.uid!, offering.id, side, chosenOption, odds);
      });
    }
  },

  resolvePick: (won) => {
    const state = get();
    if (!state.activePick) return;

    const offeringId = state.activePick.offeringId;

    const updatedHistory = state.pickHistory.map((r) =>
      r.offeringId === offeringId && r.status === 'pending'
        ? { ...r, status: (won ? 'won' : 'lost') as PickRecord['status'] }
        : r
    );

    set({
      activePick: null,
      weeklyStreak: won ? state.weeklyStreak + 1 : 0,
      weeklyWins: won ? state.weeklyWins + 1 : state.weeklyWins,
      allTimeWins: won ? state.allTimeWins + 1 : state.allTimeWins,
      pickHistory: updatedHistory,
    });

    if (USE_FIREBASE && state.uid) {
      import('../firebase/collections').then(({ resolvePick: resolvePickFB }) => {
        resolvePickFB(state.uid!, offeringId, won);
      });
    }
  },

  resetWeek: () => {
    set({ weeklyStreak: 0, weeklyWins: 0 });
  },

  resetDemo: () => {
    set({
      activePick: null,
      pendingSelection: null,
      submittedPick: null,
      submitted: false,
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
    });
  },

  linkESPN: () => set({ espnLinked: true }),
  linkDK: () => set({ dkLinked: true }),

  setUser: (uid) => set({ uid }),

  syncFromFirebase: (data) => set({
    weeklyStreak: data.weeklyStreak,
    weeklyWins: data.weeklyWins,
    allTimeWins: data.allTimeWins,
  }),
}));
