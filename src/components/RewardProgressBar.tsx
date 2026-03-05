import { useGameStore } from '../store/gameStore';
import { rewardTiers } from '../data/rewards';

export default function RewardProgressBar() {
  const weeklyWins = useGameStore((s) => s.weeklyWins);
  const maxThreshold = rewardTiers[rewardTiers.length - 1].threshold;
  const progress = Math.min((weeklyWins / maxThreshold) * 100, 100);

  return (
    <div
      className="border rounded-xl p-5"
      style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>Weekly Progress</span>
        <span className="text-sm font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>{weeklyWins} / {maxThreshold} wins</span>
      </div>

      <div className="relative h-3 rounded-full overflow-hidden mb-4" style={{ backgroundColor: 'var(--color-theme-bg)' }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ background: 'linear-gradient(to right, #3772DF, #1a4fbf)', width: `${progress}%` }}
        />
        {rewardTiers.map((tier) => (
          <div
            key={tier.id}
            className="absolute top-0 h-full w-0.5"
            style={{ left: `${(tier.threshold / maxThreshold) * 100}%`, backgroundColor: 'var(--color-theme-border-hover)' }}
          />
        ))}
      </div>

      <div className="flex justify-between">
        {rewardTiers.map((tier) => (
          <div
            key={tier.id}
            className="text-center"
            style={{ color: weeklyWins >= tier.threshold ? '#3772DF' : 'var(--color-theme-text-muted)' }}
          >
            <div className="text-lg">{tier.icon}</div>
            <div className="text-xs mt-0.5">{tier.threshold}W</div>
          </div>
        ))}
      </div>
    </div>
  );
}
