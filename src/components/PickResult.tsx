import { useGameStore } from '../store/gameStore';

export default function PickResult() {
  const { lastResult, weeklyStreak, clearResult } = useGameStore();

  if (!lastResult) return null;

  const isWin = lastResult === 'won';

  return (
    /* 75% black overlay — matches Figma "Black Overlay" node */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      {/* Modal card — 10px radius, surface bg, centered */}
      <div
        className={`relative mx-6 w-full max-w-[339px] rounded-[10px] overflow-hidden ${
          isWin ? 'animate-confetti-pop' : 'animate-loss-shake'
        }`}
        style={{ backgroundColor: 'var(--color-theme-surface)' }}
      >
        {/* Close button — top-right, matches Figma Action/X Close */}
        <button
          onClick={clearResult}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors"
          style={{ color: 'var(--color-theme-text-muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-theme-text)'; e.currentTarget.style.backgroundColor = 'var(--color-theme-surface-alt)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-theme-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Top accent bar */}
        <div
          className="h-1"
          style={{ backgroundColor: isWin ? '#2dcc30' : '#ff3232' }}
        />

        {/* Content area — matches Figma modal Content node */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6 gap-5">
          {/* Result icon */}
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full"
            style={{
              backgroundColor: isWin ? 'rgba(45, 204, 48, 0.12)' : 'rgba(255, 50, 50, 0.12)',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isWin ? '#2dcc30' : '#ff3232'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isWin ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              )}
            </svg>
          </div>

          {/* Title — Title 2 style from Figma: 20px bold */}
          <div className="text-center">
            <h2
              className="text-[20px] leading-[26px] font-bold font-title"
              style={{ color: 'var(--color-theme-text)' }}
            >
              {isWin ? 'Pick Correct!' : 'Streak Over'}
            </h2>
            {/* Subtitle — Caption 2 style: 10px regular */}
            <p
              className="mt-2 text-xs font-body"
              style={{ color: 'var(--color-theme-text-tertiary)' }}
            >
              {isWin
                ? `Your streak is now ${weeklyStreak}. Keep it going!`
                : 'Your streak has been reset to 0.'}
            </p>
          </div>

          {/* Dotted divider — matches Figma Divider node */}
          <div
            className="w-full h-px"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, var(--color-theme-border) 0, var(--color-theme-border) 4px, transparent 4px, transparent 8px)`,
            }}
          />

          {/* Streak stat */}
          <div className="flex items-center gap-3 w-full justify-center">
            <div
              className="flex flex-col items-center rounded-xl px-5 py-3"
              style={{ backgroundColor: 'var(--color-theme-surface-alt)' }}
            >
              <span
                className="text-2xl font-bold font-display tabular-nums"
                style={{ color: isWin ? '#3772DF' : 'var(--color-theme-text-muted)' }}
              >
                {weeklyStreak}
              </span>
              <span className="text-[11px] leading-[12px] tracking-[0.02em] mt-0.5" style={{ color: 'var(--color-theme-text-muted)' }}>
                STREAK
              </span>
            </div>
          </div>

          {/* CTA buttons — outline pill matching Figma CTAs/In Card */}
          <div className="flex gap-[6px] w-full">
            <button
              onClick={clearResult}
              className="cta-pill flex-1"
            >
              {isWin ? 'Keep Going' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
