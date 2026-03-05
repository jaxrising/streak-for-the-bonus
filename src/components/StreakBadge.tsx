import { useGameStore } from '../store/gameStore';

export default function StreakBadge() {
  const streak = useGameStore((s) => s.weeklyStreak);

  return (
    <div className="flex items-center gap-3">
      <div className={`text-4xl ${streak >= 3 ? 'animate-streak-pulse' : ''}`}>
        🔥
      </div>
      <div>
        <div className="text-3xl font-display font-black tabular-nums" style={{ color: 'var(--color-theme-text)' }}>{streak}</div>
        <div className="text-xs uppercase tracking-wider font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>Win Streak</div>
      </div>
    </div>
  );
}
