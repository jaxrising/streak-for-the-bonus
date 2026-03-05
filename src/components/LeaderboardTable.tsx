import type { LeaderboardUser } from '../types';

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  sortBy: 'weekly' | 'allTime';
}

export default function LeaderboardTable({ users, sortBy }: LeaderboardTableProps) {
  const sorted = [...users].sort((a, b) =>
    sortBy === 'weekly' ? b.weeklyWins - a.weeklyWins : b.allTimeWins - a.allTimeWins
  );

  return (
    <div className="space-y-2">
      {sorted.map((user, i) => (
        <div
          key={user.username}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all animate-fade-in-up border ${
            user.isCurrentUser
              ? ''
              : ''
          }`}
          style={{
            backgroundColor: user.isCurrentUser ? 'rgba(55, 114, 223, 0.1)' : 'var(--color-theme-surface)',
            borderColor: user.isCurrentUser ? 'rgba(55, 114, 223, 0.3)' : 'var(--color-theme-border)',
          }}
          data-delay={`${i * 50}ms`}
        >
          <div className="w-8 text-center text-[16px] leading-[24px] font-bold font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>
            {i + 1}
          </div>
          <div className="text-xl">{user.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] leading-[20px] font-medium truncate"
              style={{ color: user.isCurrentUser ? '#3772DF' : 'var(--color-theme-text)' }}
            >
              {user.username}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>
              🔥 {user.weeklyStreak} streak
            </div>
          </div>
          <div className="text-right">
            <div className="text-[18px] leading-[24px] font-bold tabular-nums font-title" style={{ color: 'var(--color-theme-text)' }}>
              {sortBy === 'weekly' ? user.weeklyWins : user.allTimeWins}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>
              {sortBy === 'weekly' ? 'weekly' : 'all-time'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
