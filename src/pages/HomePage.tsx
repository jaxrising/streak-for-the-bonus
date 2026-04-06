import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { offerings } from '../data/offerings';
import { resolveOutcome, RESOLVE_DELAY_MS } from '../lib/resolution';
import { getCurrentWeekInfo } from '../lib/weekUtils';
import StreakBadge from '../components/StreakBadge';
import RewardStatusStrip from '../components/RewardStatusStrip';
import PickCard from '../components/PickCard';
import { PicksTooltip } from '../components/HowToPlay';
import { FireFlameIcon, StarIcon } from '../components/icons';
import draftkingsAd from '/draftkings-ad.png';

export default function HomePage() {
  const { activePick, resolvePick, weeklyWins, weeklyStreak, resetDemo } = useGameStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const weekInfo = getCurrentWeekInfo();

  const resolve = useCallback(() => {
    const won = resolveOutcome();
    resolvePick(won);
  }, [resolvePick]);

  useEffect(() => {
    if (!activePick) return;
    timerRef.current = setTimeout(resolve, RESOLVE_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activePick, resolve]);

  return (
    <div className="space-y-5">
      {/* Dual stats bar */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl border px-4 py-3"
          style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
        >
          <StreakBadge value={weeklyStreak} label="Win Streak" icon={<FireFlameIcon size={36} />} pulse={weeklyStreak >= 3} />
        </div>
        <div
          className="rounded-xl border px-4 py-3"
          style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
        >
          <StreakBadge value={weeklyWins} label="Total Wins" icon={<StarIcon size={36} />} />
        </div>
      </div>

      {/* Week label */}
      <div className="text-center">
        <span className="text-[12px] leading-[14px] tracking-[0.02em] font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>
          {weekInfo.label}
        </span>
      </div>

      {/* Reward status strip */}
      <RewardStatusStrip />

      {/* First-pick tooltip */}
      <PicksTooltip />

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] leading-[24px] font-bold uppercase font-title" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Today's Picks
        </h2>
        <span className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{offerings.length} available</span>
      </div>

      {/* Offering cards — first 6 (3 rows on sm) */}
      <div className="grid gap-3 sm:grid-cols-2">
        {offerings.slice(0, 6).map((offering, i) => (
          <PickCard key={offering.id} offering={offering} index={i} />
        ))}
      </div>

      {/* DraftKings ad */}
      <img
        src={draftkingsAd}
        alt="DraftKings"
        className="w-full rounded-xl"
      />

      {/* Offering cards — remaining */}
      {offerings.length > 6 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {offerings.slice(6).map((offering, i) => (
            <PickCard key={offering.id} offering={offering} index={i + 6} />
          ))}
        </div>
      )}

      {/* Reset Demo */}
      <div className="pt-4 text-center">
        <button
          onClick={resetDemo}
          className="text-xs transition-colors underline"
          style={{ color: 'var(--color-theme-text-muted)' }}
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
}
