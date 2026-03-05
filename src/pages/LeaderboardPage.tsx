import { useState, useMemo } from 'react';
import { leaderboardUsers } from '../data/leaderboard';
import { useGameStore } from '../store/gameStore';
import TabToggle from '../components/TabToggle';
import LeaderboardTable from '../components/LeaderboardTable';

export default function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState(0);
  const [scope, setScope] = useState(0);

  const { weeklyStreak, weeklyWins, allTimeWins } = useGameStore();

  const users = useMemo(() => {
    const updated = leaderboardUsers.map((u) =>
      u.isCurrentUser
        ? { ...u, weeklyStreak, weeklyWins, allTimeWins }
        : u
    );

    if (scope === 1) {
      return updated.filter((_, i) => i % 2 === 0 || updated[i].isCurrentUser);
    }
    return updated;
  }, [timeFrame, scope, weeklyStreak, weeklyWins, allTimeWins]);

  return (
    <div className="space-y-5">
      <h2 className="text-[20px] leading-[26px] font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>Leaderboard</h2>

      <div className="space-y-3">
        <TabToggle options={['Weekly', 'All-Time']} active={timeFrame} onChange={setTimeFrame} />
        <TabToggle options={['Global', 'My Group']} active={scope} onChange={setScope} />
      </div>

      <LeaderboardTable
        users={users}
        sortBy={timeFrame === 0 ? 'weekly' : 'allTime'}
      />
    </div>
  );
}
