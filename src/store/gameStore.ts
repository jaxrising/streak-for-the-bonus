import { create } from 'zustand';
import type { Achievement, AchievementContext, ActivePick, PickRecord, PickSide, Offering } from '../types';
import { achievements } from '../data/rewards';

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
  longestWeeklyStreak: number;
  weeklyWins: number;
  allTimeWins: number;
  pickHistory: PickRecord[];
  espnLinked: boolean;
  dkLinked: boolean;
  uid: string | null;
  newlyEarnedAchievement: Achievement | null;
  // Consecutive tracking
  lastWinDate: string | null;
  consecutiveDaysWithWin: number;
  consecutiveWeeksWithWin: number;
  consecutiveWeeksStreakThreshold: number;
  consecutiveWeeksWinsThreshold: number;
  // Weekly leaderboard flags (set server-side)
  isWeeklyStreakLeader: boolean;
  isWeeklyWinsLeader: boolean;

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
  clearAchievementToast: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  activePick: null,
  pendingSelection: null,
  submittedPick: null,
  submitted: false,
  weeklyStreak: 0,
  longestWeeklyStreak: 0,
  weeklyWins: 0,
  allTimeWins: 0,
  uid: null,
  pickHistory: [],
  espnLinked: false,
  dkLinked: false,
  newlyEarnedAchievement: null,
  lastWinDate: null,
  consecutiveDaysWithWin: 0,
  consecutiveWeeksWithWin: 0,
  consecutiveWeeksStreakThreshold: 0,
  consecutiveWeeksWinsThreshold: 0,
  isWeeklyStreakLeader: false,
  isWeeklyWinsLeader: false,

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
      const today = new Date().toISOString().split('T')[0];
      import('firebase/firestore').then(({ doc, setDoc }) => {
        import('../firebase/config').then(({ db }) => {
          setDoc(doc(db, 'users', state.uid!, 'activePick', 'current'), {
            offeringId,
            side,
            chosenOption,
            startedAt: Date.now(),
            date: today,
          });
        });
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

    const newStreak = won ? state.weeklyStreak + 1 : 0;
    const newWeeklyWins = won ? state.weeklyWins + 1 : state.weeklyWins;
    const newAllTimeWins = won ? state.allTimeWins + 1 : state.allTimeWins;
    const newLongest = Math.max(state.longestWeeklyStreak, newStreak);

    // Consecutive days tracking
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let newConsecutiveDays = state.consecutiveDaysWithWin;
    let newLastWinDate = state.lastWinDate;
    if (won && state.lastWinDate !== today) {
      newConsecutiveDays = state.lastWinDate === yesterday ? state.consecutiveDaysWithWin + 1 : 1;
      newLastWinDate = today;
    }

    const ctx: AchievementContext = {
      consecutiveDaysWithWin: newConsecutiveDays,
      consecutiveWeeksWithWin: state.consecutiveWeeksWithWin,
      consecutiveWeeksStreakThreshold: state.consecutiveWeeksStreakThreshold,
      consecutiveWeeksWinsThreshold: state.consecutiveWeeksWinsThreshold,
      accountLinked: state.espnLinked && state.dkLinked,
      isWeeklyStreakLeader: state.isWeeklyStreakLeader,
      isWeeklyWinsLeader: state.isWeeklyWinsLeader,
    };

    set({
      activePick: null,
      weeklyStreak: newStreak,
      longestWeeklyStreak: newLongest,
      weeklyWins: newWeeklyWins,
      allTimeWins: newAllTimeWins,
      pickHistory: updatedHistory,
      lastWinDate: newLastWinDate,
      consecutiveDaysWithWin: newConsecutiveDays,
    });

    if (won) {
      const previouslyEarned = new Set(
        achievements
          .filter((a) => a.condition(state.weeklyWins, state.weeklyStreak, state.allTimeWins, ctx))
          .map((a) => a.id)
      );
      const newlyEarned = achievements.find(
        (a) => !previouslyEarned.has(a.id) && a.condition(newWeeklyWins, newStreak, newAllTimeWins, ctx)
      );
      if (newlyEarned) {
        set({ newlyEarnedAchievement: newlyEarned });
      }
    }

    if (USE_FIREBASE && state.uid) {
      import('../firebase/collections').then(({ resolvePick: resolvePickFB }) => {
        resolvePickFB(state.uid!, offeringId, won);
      });
    }
  },

  resetWeek: () => {
    const state = get();
    const WINS_THRESHOLD = 3;
    const STREAK_THRESHOLD = 3;
    set({
      weeklyStreak: 0,
      longestWeeklyStreak: 0,
      weeklyWins: 0,
      consecutiveWeeksWithWin: state.weeklyWins > 0 ? state.consecutiveWeeksWithWin + 1 : 0,
      consecutiveWeeksStreakThreshold: state.longestWeeklyStreak >= STREAK_THRESHOLD ? state.consecutiveWeeksStreakThreshold + 1 : 0,
      consecutiveWeeksWinsThreshold: state.weeklyWins >= WINS_THRESHOLD ? state.consecutiveWeeksWinsThreshold + 1 : 0,
    });
  },

  resetDemo: () => {
    set({
      activePick: null,
      pendingSelection: null,
      submittedPick: null,
      submitted: false,
      weeklyStreak: 0,
      longestWeeklyStreak: 0,
      weeklyWins: 0,
      allTimeWins: 0,
      pickHistory: [],
      espnLinked: false,
      dkLinked: false,
      lastWinDate: null,
      consecutiveDaysWithWin: 0,
      consecutiveWeeksWithWin: 0,
      consecutiveWeeksStreakThreshold: 0,
      consecutiveWeeksWinsThreshold: 0,
    });
  },

  linkESPN: () => set({ espnLinked: true }),
  linkDK: () => {
    set({ dkLinked: true });
    // Check for Link Up achievement
    const state = get();
    const ctx: AchievementContext = {
      consecutiveDaysWithWin: state.consecutiveDaysWithWin,
      consecutiveWeeksWithWin: state.consecutiveWeeksWithWin,
      consecutiveWeeksStreakThreshold: state.consecutiveWeeksStreakThreshold,
      consecutiveWeeksWinsThreshold: state.consecutiveWeeksWinsThreshold,
      accountLinked: true,
      isWeeklyStreakLeader: state.isWeeklyStreakLeader,
      isWeeklyWinsLeader: state.isWeeklyWinsLeader,
    };
    const linkAchievement = achievements.find(
      (a) => a.id === 'link-up' && !a.condition(state.weeklyWins, state.weeklyStreak, state.allTimeWins, { ...ctx, accountLinked: false })
        && a.condition(state.weeklyWins, state.weeklyStreak, state.allTimeWins, ctx)
    );
    if (linkAchievement) set({ newlyEarnedAchievement: linkAchievement });
  },
  clearAchievementToast: () => set({ newlyEarnedAchievement: null }),

  setUser: (uid) => set({ uid }),

  syncFromFirebase: (data) => set({
    weeklyStreak: data.weeklyStreak,
    weeklyWins: data.weeklyWins,
    allTimeWins: data.allTimeWins,
  }),
}));
