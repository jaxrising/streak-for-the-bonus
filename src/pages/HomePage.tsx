import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { offerings } from '../data/offerings';
import { resolveOutcome, RESOLVE_DELAY_MS } from '../lib/resolution';
import StreakBadge from '../components/StreakBadge';
import PickCard from '../components/PickCard';

export default function HomePage() {
  const { activePick, resolvePick, weeklyWins, allTimeWins, resetDemo } = useGameStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      {/* Streak + stats */}
      <div className="flex items-center justify-between">
        <StreakBadge />
        <div className="text-right space-y-1">
          <div className="text-xs" style={{ color: 'var(--color-theme-text-tertiary)' }}>
            Weekly <span className="font-bold" style={{ color: 'var(--color-theme-text)' }}>{weeklyWins}W</span>
          </div>
          <div className="text-xs" style={{ color: 'var(--color-theme-text-tertiary)' }}>
            All-Time <span className="font-bold" style={{ color: 'var(--color-theme-text)' }}>{allTimeWins}W</span>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider font-title" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Today's Picks
        </h2>
        <span className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{offerings.length} available</span>
      </div>

      {/* Offering cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {offerings.map((offering, i) => (
          <PickCard key={offering.id} offering={offering} index={i} />
        ))}
      </div>

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
