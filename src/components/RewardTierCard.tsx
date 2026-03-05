import type { RewardTier } from '../types';
import { useGameStore } from '../store/gameStore';

export default function RewardTierCard({ tier, index }: { tier: RewardTier; index: number }) {
  const weeklyWins = useGameStore((s) => s.weeklyWins);
  const unlocked = weeklyWins >= tier.threshold;

  return (
    <div
      className={`relative border rounded-xl p-5 transition-all duration-300 animate-fade-in-up ${
        unlocked
          ? 'shadow-[0_0_15px_rgba(55,114,223,0.15)]'
          : ''
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        backgroundColor: unlocked ? 'var(--color-theme-surface)' : 'var(--color-theme-surface)',
        borderColor: unlocked ? 'rgba(55, 114, 223, 0.5)' : 'var(--color-theme-border)',
        opacity: unlocked ? 1 : 0.7,
      }}
    >
      {unlocked && (
        <div className="absolute top-3 right-3 text-[11px] leading-[12px] tracking-[0.02em] font-bold font-title text-status-success bg-status-success/10 px-2 py-1 rounded-full">
          UNLOCKED
        </div>
      )}

      <div className="text-3xl mb-3">{tier.icon}</div>
      <h3
        className="text-[18px] leading-[24px] font-bold font-title mb-1"
        style={{ color: unlocked ? 'var(--color-theme-text)' : 'var(--color-theme-text-muted)' }}
      >
        {tier.title}
      </h3>
      <p className="text-xs mb-3" style={{ color: 'var(--color-theme-text-tertiary)' }}>{tier.description}</p>
      <div
        className="text-[14px] leading-[20px] font-bold font-title"
        style={{ color: unlocked ? '#2dcc30' : 'var(--color-theme-text-muted)' }}
      >
        {tier.prize}
      </div>
    </div>
  );
}
