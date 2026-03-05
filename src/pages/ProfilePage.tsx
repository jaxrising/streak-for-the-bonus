import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { achievements } from '../data/rewards';
import AchievementBadge from '../components/AchievementBadge';
import PickHistoryList from '../components/PickHistoryList';

export default function ProfilePage() {
  const { weeklyStreak, weeklyWins, allTimeWins, pickHistory } = useGameStore();

  const computedAchievements = useMemo(
    () =>
      achievements.map((a) => ({
        ...a,
        earned: a.condition(weeklyWins, weeklyStreak, allTimeWins),
      })),
    [weeklyWins, weeklyStreak, allTimeWins]
  );

  const totalPicks = pickHistory.length;
  const wins = pickHistory.filter((p) => p.status === 'won').length;
  const winRate = totalPicks > 0 ? Math.round((wins / totalPicks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="text-center">
        <div className="text-5xl mb-2">🔥</div>
        <h2 className="text-xl font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>You</h2>
        <p className="text-sm" style={{ color: 'var(--color-theme-text-tertiary)' }}>Streak Player</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Streak', value: weeklyStreak, color: '#3772DF' },
          { label: 'Weekly W', value: weeklyWins, color: '#2dcc30' },
          { label: 'All-Time', value: allTimeWins, color: 'var(--color-theme-text)' },
          { label: 'Win %', value: `${winRate}%`, color: '#ffc432' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border rounded-xl p-3 text-center"
            style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
          >
            <div className="text-lg font-bold font-display tabular-nums" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider font-title mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Achievements ({computedAchievements.filter((a) => a.earned).length}/{computedAchievements.length})
        </h3>
        <div className="space-y-2">
          {computedAchievements.map((a, i) => (
            <AchievementBadge key={a.id} achievement={a} index={i} />
          ))}
        </div>
      </div>

      {/* Pick History */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider font-title mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Pick History
        </h3>
        <PickHistoryList />
      </div>
    </div>
  );
}
