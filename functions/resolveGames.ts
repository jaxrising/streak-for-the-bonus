/**
 * Firebase Cloud Function: resolveGames
 *
 * Runs on a schedule (every 5 minutes) to check game results and resolve picks.
 *
 * Deploy with: firebase deploy --only functions
 *
 * Prerequisites:
 * - firebase-admin and firebase-functions installed
 * - Firestore rules allowing admin access
 * - ESPN scoreboard API is public (no auth needed)
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const ESPN_SCOREBOARD_BASE = 'https://site.api.espn.com/apis/site/v2/sports';

const SPORT_PATHS: Record<string, string> = {
  NFL: 'football/nfl',
  NBA: 'basketball/nba',
  MLB: 'baseball/mlb',
  NHL: 'hockey/nhl',
  WNBA: 'basketball/wnba',
  Soccer: 'soccer/eng.1',
};

interface GameResult {
  completed: boolean;
  winner: string | null;
  teamA: string;
  teamB: string;
}

async function fetchResults(sport: string): Promise<GameResult[]> {
  const path = SPORT_PATHS[sport];
  if (!path) return [];

  const url = `${ESPN_SCOREBOARD_BASE}/${path}/scoreboard`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  return (data.events ?? []).map((event: any) => {
    const comp = event.competitions?.[0];
    if (!comp) return { completed: false, winner: null, teamA: '', teamB: '' };

    return {
      completed: comp.status?.type?.completed ?? false,
      winner: comp.competitors?.find((c: any) => c.winner)?.team?.displayName ?? null,
      teamA: comp.competitors?.[0]?.team?.displayName ?? '',
      teamB: comp.competitors?.[1]?.team?.displayName ?? '',
    };
  });
}

export const resolveGames = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    const pendingSnap = await db.collection('picks')
      .where('status', '==', 'pending')
      .get();

    if (pendingSnap.empty) {
      functions.logger.info('No pending picks to resolve');
      return;
    }

    const sportSet = new Set<string>();
    const picks: { id: string; uid: string; offeringId: string; side: string; chosenOption: string }[] = [];

    for (const doc of pendingSnap.docs) {
      const data = doc.data();
      picks.push({
        id: doc.id,
        uid: data.uid,
        offeringId: data.offeringId,
        side: data.side,
        chosenOption: data.chosenOption,
      });
    }

    // Fetch offering details to know the sport
    const offeringIds = [...new Set(picks.map((p) => p.offeringId))];
    for (const id of offeringIds) {
      // In production, offerings would be stored in Firestore too
      // For now, infer sport from offering ID prefix
      const sport = id.split('-')[0]?.toUpperCase();
      if (sport && SPORT_PATHS[sport]) sportSet.add(sport);
    }

    const allResults: GameResult[] = [];
    for (const sport of sportSet) {
      const results = await fetchResults(sport);
      allResults.push(...results);
    }

    const batch = db.batch();
    let resolvedCount = 0;

    for (const pick of picks) {
      const matchingResult = allResults.find((r) =>
        r.completed &&
        r.winner &&
        (r.teamA.toLowerCase().includes(pick.chosenOption.toLowerCase().split(' ').pop()!) ||
         r.teamB.toLowerCase().includes(pick.chosenOption.toLowerCase().split(' ').pop()!))
      );

      if (!matchingResult || !matchingResult.winner) continue;

      const won = matchingResult.winner.toLowerCase() === pick.chosenOption.toLowerCase();
      const pickRef = db.collection('picks').doc(pick.id);
      const userRef = db.collection('users').doc(pick.uid);

      batch.update(pickRef, {
        status: won ? 'won' : 'lost',
        resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (won) {
        batch.update(userRef, {
          weeklyWins: admin.firestore.FieldValue.increment(1),
          allTimeWins: admin.firestore.FieldValue.increment(1),
          weeklyStreak: admin.firestore.FieldValue.increment(1),
        });
      } else {
        batch.update(userRef, { weeklyStreak: 0 });
      }

      resolvedCount++;
    }

    if (resolvedCount > 0) {
      await batch.commit();
      functions.logger.info(`Resolved ${resolvedCount} picks`);
    }
  });

/**
 * HTTP-triggered version for manual resolution or testing.
 * Call via: https://<region>-<project>.cloudfunctions.net/resolveGamesHttp
 */
export const resolveGamesHttp = functions.https.onRequest(async (_req, res) => {
  // Same logic as scheduled function — trigger manually for testing
  res.json({ message: 'Use the scheduled function for production resolution' });
});
