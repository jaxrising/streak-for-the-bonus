import { useState, useMemo } from 'react';
import { leaderboardUsers } from '../data/leaderboard';
import { useGameStore } from '../store/gameStore';
import LeaderboardTable from '../components/LeaderboardTable';

type TimeFrame = 'daily' | 'weekly' | 'allTime';

export default function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('weekly');
  const { weeklyStreak, weeklyWins, allTimeWins } = useGameStore();

  const users = useMemo(() =>
    leaderboardUsers.map((u) =>
      u.isCurrentUser
        ? { ...u, weeklyStreak, weeklyWins, allTimeWins }
        : u
    ),
    [weeklyStreak, weeklyWins, allTimeWins]
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] leading-[26px] font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>Leaderboard</h2>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
          className="text-[12px] leading-[14px] tracking-[0.02em] font-body font-medium rounded-full pl-[15px] pr-[30px] py-1.5 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-theme-surface)',
            color: 'var(--color-theme-text)',
            border: '1px solid var(--color-theme-border)',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="allTime">All-Time</option>
        </select>
      </div>

      <LeaderboardTable users={users} sortBy={timeFrame} />
    </div>
  );
}
