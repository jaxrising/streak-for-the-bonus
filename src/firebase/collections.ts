import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import type { PickSide } from '../types';

// --- Collection references ---

export const usersCol = collection(db, 'users');
export const picksCol = collection(db, 'picks');
export const leaderboardCol = collection(db, 'leaderboard');

// --- User profile ---

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  weeklyStreak: number;
  weeklyWins: number;
  allTimeWins: number;
  weeklyPicks: number;
  allTimePicks: number;
  hasSeenHowToPlay: boolean;
  createdAt: unknown;
  lastPickAt: unknown;
}

export async function getOrCreateUser(uid: string, displayName: string, email: string): Promise<UserProfile> {
  const ref = doc(usersCol, uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid,
    displayName,
    email,
    weeklyStreak: 0,
    weeklyWins: 0,
    allTimeWins: 0,
    weeklyPicks: 0,
    allTimePicks: 0,
    hasSeenHowToPlay: false,
    createdAt: serverTimestamp(),
    lastPickAt: null,
  };

  await setDoc(ref, profile);
  return profile;
}

// --- Picks ---

export interface PickDocument {
  uid: string;
  offeringId: string;
  side: PickSide;
  chosenOption: string;
  odds: string;
  status: 'pending' | 'won' | 'lost';
  createdAt: unknown;
  resolvedAt: unknown | null;
}

export async function recordPick(
  uid: string,
  offeringId: string,
  side: PickSide,
  chosenOption: string,
  odds: string,
) {
  const pickId = `${uid}_${offeringId}`;
  const ref = doc(picksCol, pickId);

  const pickDoc: PickDocument = {
    uid,
    offeringId,
    side,
    chosenOption,
    odds,
    status: 'pending',
    createdAt: serverTimestamp(),
    resolvedAt: null,
  };

  await setDoc(ref, pickDoc);

  const userRef = doc(usersCol, uid);
  await updateDoc(userRef, {
    weeklyPicks: increment(1),
    allTimePicks: increment(1),
    lastPickAt: serverTimestamp(),
  });

  return pickId;
}

// --- Pick percentage (global) ---

export async function getPickPercentages(offeringId: string): Promise<{ pctA: number; pctB: number }> {
  const q = query(picksCol, where('offeringId', '==', offeringId));

  return new Promise((resolve) => {
    const unsubscribe = onSnapshot(q, (snap) => {
      unsubscribe();
      let countA = 0;
      let countB = 0;
      snap.forEach((doc) => {
        const data = doc.data() as DocumentData;
        if (data.side === 'A') countA++;
        else countB++;
      });
      const total = countA + countB;
      if (total === 0) {
        resolve({ pctA: 50, pctB: 50 });
      } else {
        resolve({
          pctA: Math.round((countA / total) * 100),
          pctB: Math.round((countB / total) * 100),
        });
      }
    });
  });
}

// --- Leaderboard (real-time) ---

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  weeklyStreak: number;
  weeklyWins: number;
  allTimeWins: number;
  weeklyPicks: number;
  allTimePicks: number;
}

export function subscribeLeaderboard(
  sortField: 'weeklyStreak' | 'weeklyWins' | 'allTimeWins',
  count: number,
  callback: (entries: LeaderboardEntry[]) => void,
) {
  const q = query(
    usersCol,
    orderBy(sortField, 'desc'),
    limit(count),
  );

  return onSnapshot(q, (snap) => {
    const entries: LeaderboardEntry[] = [];
    snap.forEach((doc) => {
      const data = doc.data() as DocumentData;
      entries.push({
        uid: doc.id,
        displayName: data.displayName,
        weeklyStreak: data.weeklyStreak ?? 0,
        weeklyWins: data.weeklyWins ?? 0,
        allTimeWins: data.allTimeWins ?? 0,
        weeklyPicks: data.weeklyPicks ?? 0,
        allTimePicks: data.allTimePicks ?? 0,
      });
    });
    callback(entries);
  });
}

// --- Resolve pick (client-side for demo, server-side in production) ---

export async function resolvePick(uid: string, offeringId: string, won: boolean) {
  const pickId = `${uid}_${offeringId}`;
  const pickRef = doc(picksCol, pickId);
  const userRef = doc(usersCol, uid);

  await updateDoc(pickRef, {
    status: won ? 'won' : 'lost',
    resolvedAt: serverTimestamp(),
  });

  if (won) {
    await updateDoc(userRef, {
      weeklyWins: increment(1),
      allTimeWins: increment(1),
      weeklyStreak: increment(1),
    });
  } else {
    await updateDoc(userRef, {
      weeklyStreak: 0,
    });
  }
}
