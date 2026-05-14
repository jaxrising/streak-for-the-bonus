import { useGameStore } from '../store/gameStore';
import { getNextReward } from '../data/rewards';
import { leaderboardUsers } from '../data/leaderboard';

function DKCrownLogo({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L9.5 8.5L3 7L6 13L3 21H21L18 13L21 7L14.5 8.5L12 2Z" />
      <circle cx="12" cy="15" r="2.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function getFireState(streak: number): 'idle' | 'warm' | 'hot' | 'blazing' | 'inferno' {
  if (streak >= 10) return 'inferno';
  if (streak >= 7) return 'blazing';
  if (streak >= 5) return 'hot';
  if (streak >= 3) return 'warm';
  return 'idle';
}

export default function EntryCard() {
  const weeklyWins = useGameStore((s) => s.weeklyWins);
  const weeklyStreak = useGameStore((s) => s.weeklyStreak);
  const allTimeWins = useGameStore((s) => s.allTimeWins);

  const currentUser = leaderboardUsers.find((u) => u.isCurrentUser);
  const totalPicks = currentUser?.weeklyPicks ?? (weeklyWins + 2);
  const winPct = totalPicks > 0 ? Math.round((weeklyWins / totalPicks) * 100) : 0;

  const rank = currentUser?.rank ?? 5;

  const streakNext = getNextReward(weeklyWins, weeklyStreak, 'streak');
  const winsNext = getNextReward(weeklyWins, weeklyStreak, 'wins');

  const fireState = getFireState(weeklyStreak);

  const stats = [
    { value: `#${rank}`, label: 'Rank' },
    { value: `${winPct}%`, label: 'PCT' },
    { value: String(weeklyStreak), label: 'Streak' },
    { value: String(allTimeWins), label: 'Wins' },
  ];

  return (
    <div
      className={`entry-card entry-card--${fireState} relative rounded-xl overflow-hidden border`}
      style={{
        backgroundColor: 'var(--color-theme-surface)',
        borderColor: fireState === 'idle' ? 'var(--color-theme-border)' : undefined,
      }}
    >
      {/* Fire particle layers */}
      {fireState !== 'idle' && (
        <>
          <div className="entry-card__embers" />
          {(fireState === 'blazing' || fireState === 'inferno') && (
            <div className="entry-card__flames" />
          )}
          {fireState === 'inferno' && (
            <div className="entry-card__inferno" />
          )}
        </>
      )}

      <div className="relative z-10 px-4 py-3">
        {/* Stats row */}
        <div className="flex items-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center flex-1">
              {i > 0 && (
                <div className="w-px h-7 mr-auto" style={{ backgroundColor: 'var(--color-theme-border)' }} />
              )}
              <div className={`text-center ${i > 0 ? 'flex-1' : 'flex-1'}`}>
                <div className="text-[20px] leading-[24px] font-bold font-title tabular-nums" style={{ color: 'var(--color-theme-text)' }}>
                  {stat.value}
                </div>
                <div className="text-[10px] leading-[12px] tracking-[0.08em] uppercase font-title mt-0.5" style={{ color: 'var(--color-theme-text-tertiary)' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px my-3" style={{ backgroundColor: 'var(--color-theme-border)' }} />

        {/* Reward progress lines */}
        <div className="space-y-1.5">
          {streakNext ? (
            <div className="flex items-center gap-2 text-[12px] leading-[16px] font-body">
              <DKCrownLogo className="shrink-0 entry-card__dk-logo" />
              <span style={{ color: 'var(--color-theme-text-secondary)' }}>
                <span className="font-medium" style={{ color: 'var(--color-theme-text)' }}>Streak:</span>{' '}
                {streakNext.gapText} for {streakNext.tier.prize}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[12px] leading-[16px] font-body">
              <DKCrownLogo className="shrink-0 entry-card__dk-logo" />
              <span style={{ color: 'var(--color-earned)' }}>
                <span className="font-medium">Streak:</span> All milestones unlocked!
              </span>
            </div>
          )}
          {winsNext ? (
            <div className="flex items-center gap-2 text-[12px] leading-[16px] font-body">
              <DKCrownLogo className="shrink-0 entry-card__dk-logo" />
              <span style={{ color: 'var(--color-theme-text-secondary)' }}>
                <span className="font-medium" style={{ color: 'var(--color-theme-text)' }}>Wins:</span>{' '}
                {winsNext.gapText} for {winsNext.tier.prize}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[12px] leading-[16px] font-body">
              <DKCrownLogo className="shrink-0 entry-card__dk-logo" />
              <span style={{ color: 'var(--color-earned)' }}>
                <span className="font-medium">Wins:</span> All milestones unlocked!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
