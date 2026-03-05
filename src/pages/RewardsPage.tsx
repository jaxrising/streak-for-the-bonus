import RewardProgressBar from '../components/RewardProgressBar';
import RewardTierCard from '../components/RewardTierCard';
import { rewardTiers } from '../data/rewards';

export default function RewardsPage() {
  return (
    <div className="space-y-5">
      <h2 className="text-[20px] leading-[26px] font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>Rewards</h2>

      <RewardProgressBar />

      <div className="space-y-3">
        {rewardTiers.map((tier, i) => (
          <RewardTierCard key={tier.id} tier={tier} index={i} />
        ))}
      </div>

      <div
        className="border rounded-xl p-4 text-center"
        style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--color-theme-text-tertiary)' }}>
          Rewards powered by <span className="text-status-success font-medium">DraftKings</span>.
          Link your account to claim prizes.
        </p>
      </div>
    </div>
  );
}
