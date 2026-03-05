import type { Achievement } from '../types';
import { Icon } from './icons';

export default function AchievementBadge({ achievement, index }: { achievement: Achievement; index: number }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all animate-fade-in-up ${
        achievement.earned ? '' : 'opacity-50'
      }`}
      style={{
        animationDelay: `${index * 60}ms`,
        backgroundColor: 'var(--color-theme-surface)',
        borderColor: achievement.earned ? 'rgba(255, 199, 44, 0.3)' : 'var(--color-theme-border)',
      }}
    >
      <div className={achievement.earned ? '' : 'grayscale'} style={{ color: 'var(--color-theme-text)' }}>
        <Icon name={achievement.icon} size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[14px] leading-[20px] font-medium"
          style={{ color: achievement.earned ? 'var(--color-theme-text)' : 'var(--color-theme-text-muted)' }}
        >
          {achievement.title}
        </div>
        <div className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{achievement.description}</div>
      </div>
      {achievement.earned && (
        <div className="text-espn-gold text-[12px] leading-[14px] tracking-[0.02em] font-bold font-title">EARNED</div>
      )}
    </div>
  );
}
