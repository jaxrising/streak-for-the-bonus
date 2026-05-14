import { useEffect, useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { useOfferings } from '../lib/useOfferings';
import { checkGameResults, determinePickOutcome } from '../lib/resolveFromResults';
import EntryCard from '../components/EntryCard';
import PickCard from '../components/PickCard';
import SportFilterChips, { type SportFilter } from '../components/SportFilterChips';
import { PicksTooltip } from '../components/HowToPlay';

export default function HomePage() {
  const { activePick, resolvePick, resetDemo } = useGameStore();
  const { offerings, loading } = useOfferings();
  const [sportFilter, setSportFilter] = useState<SportFilter>('all');

  const availableLeagues = useMemo(() => {
    return [...new Set(offerings.map(o => o.league))];
  }, [offerings]);

  const filteredOfferings = useMemo(() => {
    if (sportFilter === 'all') return offerings;
    return offerings.filter(o => o.league === sportFilter);
  }, [sportFilter, offerings]);

  useEffect(() => {
    if (!activePick) return;

    const offering = offerings.find((o) => o.id === activePick.offeringId);
    if (!offering) return;

    let cancelled = false;

    const pollForResult = async () => {
      while (!cancelled) {
        const results = await checkGameResults(offering.sport);
        const outcome = determinePickOutcome(offering, activePick.side, results);

        if (outcome !== 'pending') {
          if (!cancelled) {
            resolvePick(outcome === 'won');
          }
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    };

    pollForResult();

    return () => { cancelled = true; };
  }, [activePick, resolvePick, offerings]);

  return (
    <div className="space-y-5">
      {/* Entry Card — stats + reward progress */}
      <EntryCard />


      {/* First-pick tooltip */}
      <PicksTooltip />

      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] leading-[24px] font-bold uppercase font-title" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Today's Picks
        </h2>
        <span className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{filteredOfferings.length} available</span>
      </div>

      {/* Sport filter chips */}
      <SportFilterChips active={sportFilter} onChange={setSportFilter} availableLeagues={availableLeagues} />

      {/* Loading state */}
      {loading && offerings.length === 0 && (
        <p className="text-center text-sm" style={{ color: 'var(--color-theme-text-muted)' }}>
          Loading today's matchups...
        </p>
      )}

      {/* Offering cards */}
      {filteredOfferings.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredOfferings.map((offering, i) => (
            <PickCard key={offering.id} offering={offering} index={i} />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-10 rounded-xl border"
          style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
        >
          <p className="text-[14px] leading-[20px] font-body" style={{ color: 'var(--color-theme-text-muted)' }}>
            No picks available for this sport today.
          </p>
          <p className="text-[12px] leading-[16px] font-body mt-1" style={{ color: 'var(--color-theme-text-disabled)' }}>
            Check back later or browse Top Events.
          </p>
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
