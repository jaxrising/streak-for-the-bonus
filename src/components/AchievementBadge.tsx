import type { Achievement } from '../types';

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
      <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-sm font-semibold"
          style={{ color: achievement.earned ? 'var(--color-theme-text)' : 'var(--color-theme-text-muted)' }}
        >
          {achievement.title}
        </div>
        <div className="text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{achievement.description}</div>
      </div>
      {achievement.earned && (
        <div className="text-espn-gold text-xs font-bold font-title">EARNED</div>
      )}
    </div>
  );
}
