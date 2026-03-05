import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { winsRewardTiers, streakRewardTiers, rewardTiers, getUnlockedRewards } from '../data/rewards';
import { getWeekEndCountdown, formatCountdown } from '../lib/weekUtils';
import RewardProgressBar from '../components/RewardProgressBar';
import RewardTierCard from '../components/RewardTierCard';
import AccountLinkCard from '../components/AccountLinkCard';
import { Icon } from '../components/icons';

export default function RewardsPage() {
  const weeklyWins = useGameStore((s) => s.weeklyWins);
  const weeklyStreak = useGameStore((s) => s.weeklyStreak);
  const espnLinked = useGameStore((s) => s.espnLinked);
  const dkLinked = useGameStore((s) => s.dkLinked);
  const linkESPN = useGameStore((s) => s.linkESPN);
  const linkDK = useGameStore((s) => s.linkDK);

  const { unlocked, totalBonusBets } = getUnlockedRewards(weeklyWins, weeklyStreak);

  const [countdown, setCountdown] = useState(() => getWeekEndCountdown());

  useEffect(() => {
    const id = setInterval(() => setCountdown(getWeekEndCountdown()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-5">
      <h2 className="text-[20px] leading-[26px] font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>Rewards</h2>

      {/* Bonus Bets Summary */}
      <div
        className="border rounded-xl p-5 text-center"
        style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
      >
        <div className="text-[12px] leading-[14px] tracking-[0.02em] uppercase font-title mb-2" style={{ color: 'var(--color-theme-text-tertiary)' }}>
          Bonus Bets Available
        </div>
        <div className="text-[36px] leading-[40px] font-display font-black tabular-nums" style={{ color: totalBonusBets > 0 ? '#2dcc30' : 'var(--color-theme-text)' }}>
          ${totalBonusBets}
        </div>
        <div className="text-[12px] leading-[14px] tracking-[0.02em] font-body mt-2" style={{ color: 'var(--color-theme-text-muted)' }}>
          {countdown.expired ? 'Week expired' : `Resets in ${formatCountdown(countdown)}`}
        </div>
      </div>

      {/* Earned Rewards List */}
      <div>
        <h3 className="text-[16px] leading-[24px] font-bold uppercase font-title mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Earned This Week
        </h3>
        {unlocked.length > 0 ? (
          <div className="space-y-2">
            {unlocked.map((tier) => (
              <div
                key={tier.id}
                className="border rounded-lg px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: 'var(--color-theme-text)' }}><Icon name={tier.icon} size={24} /></span>
                  <div>
                    <div className="text-[14px] leading-[20px] font-bold font-title" style={{ color: 'var(--color-theme-text)' }}>
                      {tier.prize}
                    </div>
                    <div className="text-[12px] leading-[14px] font-body" style={{ color: 'var(--color-theme-text-tertiary)' }}>
                      {tier.description}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] leading-[12px] tracking-[0.02em] font-bold font-title text-status-success bg-status-success/10 px-2 py-1 rounded-full">
                  EARNED
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="border rounded-xl p-6 text-center"
            style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
          >
            <p className="text-[14px] leading-[20px] font-body" style={{ color: 'var(--color-theme-text-tertiary)' }}>
              Keep picking to earn bonus bets!
            </p>
          </div>
        )}
      </div>

      {/* Dual Progress Bars */}
      <div>
        <h3 className="text-[16px] leading-[24px] font-bold uppercase font-title mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Progress
        </h3>
        <div className="space-y-3">
          <RewardProgressBar type="streak" currentValue={weeklyStreak} tiers={streakRewardTiers} label="Streak Progress" />
          <RewardProgressBar type="wins" currentValue={weeklyWins} tiers={winsRewardTiers} label="Wins Progress" />
        </div>
      </div>

      {/* All Reward Tiers */}
      <div>
        <h3 className="text-[16px] leading-[24px] font-bold uppercase font-title mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
          All Rewards
        </h3>
        <div className="space-y-3">
          {rewardTiers.map((tier, i) => (
            <RewardTierCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>
      </div>

      {/* Account Linking */}
      <div>
        <h3 className="text-[16px] leading-[24px] font-bold uppercase font-title mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
          Linked Accounts
        </h3>
        <div className="space-y-3">
          <AccountLinkCard platform="ESPN" linked={espnLinked} onLink={linkESPN} />
          <AccountLinkCard platform="DraftKings" linked={dkLinked} onLink={linkDK} disabled={!espnLinked} />
        </div>
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
