import { useState, useRef, useEffect } from 'react';

const SEEN_KEY = 'streak-htp-seen';

const cards = [
  {
    headline: 'Pick. Streak. Win.',
    body: 'Streak for the Bonus is a free daily prediction game. Make picks on real sports matchups and earn DraftKings Bonus Bets every week.',
    icon: '🏈',
  },
  {
    headline: 'One Pick at a Time',
    body: 'Choose a side on any available matchup\u2014spreads, totals, player props, and more. Wait for your result, then pick again.',
    icon: '☝️',
  },
  {
    headline: 'Stack Wins, Build Streaks',
    body: 'Every correct pick extends your streak. The longer your streak, the bigger your rewards. A loss resets it\u2014so choose wisely.',
    icon: '🔥',
  },
  {
    headline: 'Two Ways to Win Big',
    body: 'Longest Streak\u2014The top weekly streak wins $10,000 in DK Bonus Bets.\nMost Wins\u2014The most correct picks in a week also wins $10,000.',
    icon: '🏆',
  },
  {
    headline: 'Hit Thresholds, Earn Bonus Bets',
    body: 'Reach streak and win milestones each week to unlock $5, $10, and $15 in DraftKings Bonus Bets. No purchase necessary\u2014ever.',
    icon: '🎁',
  },
  {
    headline: 'Compete Solo or in Groups',
    body: 'Create or join a group, climb the leaderboard, and talk trash. Daily, weekly, and all-time rankings keep it competitive.',
    icon: '👥',
  },
  {
    headline: '365 Days a Year',
    body: 'NFL, NBA, MLB, NHL, soccer, golf, and more. New matchups drop daily. Weeks run Tuesday\u2013Monday so Monday Night Football is always the finale.',
    icon: '📅',
  },
  {
    headline: 'Link & Play',
    body: 'Connect your ESPN and DraftKings accounts to claim your prizes. Then make your first pick\u2014your streak starts now.',
    icon: '🔗',
  },
];

function HelpCircleIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 19.5 19.5" fill="none">
      <path d="M8.95001 12.95H10.55V14.55H8.95001V12.95Z" fill="currentColor" />
      <path d="M8.5 4.5C7.25736 4.5 6.25 5.50736 6.25 6.75V7.75H7.75V6.75C7.75 6.33579 8.08579 6 8.5 6H11C11.4142 6 11.75 6.33579 11.75 6.75V7.85955C11.75 8.13401 11.6001 8.38655 11.3591 8.51797L9.91201 9.30732C9.3498 9.61397 9 10.2032 9 10.8436V11.75H10.5V10.8436C10.5 10.7521 10.55 10.668 10.6303 10.6242L12.0774 9.83482C12.8003 9.44054 13.25 8.68293 13.25 7.85955V6.75C13.25 5.50736 12.2426 4.5 11 4.5H8.5Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M0 9.75C0 4.36522 4.36522 0 9.75 0C15.1348 0 19.5 4.36522 19.5 9.75C19.5 15.1348 15.1348 19.5 9.75 19.5C4.36522 19.5 0 15.1348 0 9.75ZM9.75 1.5C5.19365 1.5 1.5 5.19365 1.5 9.75C1.5 14.3063 5.19365 18 9.75 18C14.3063 18 18 14.3063 18 9.75C18 5.19365 14.3063 1.5 9.75 1.5Z" fill="currentColor" />
    </svg>
  );
}

/** Returns true if the user has never seen the How To Play flow */
function isFirstVisit(): boolean {
  try { return !localStorage.getItem(SEEN_KEY); } catch { return true; }
}

function markSeen() {
  try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
}

const TOOLTIP_KEY = SEEN_KEY + '-tooltip-dismissed';

export function HowToPlayButton() {
  const [open, setOpen] = useState(() => isFirstVisit());

  const handleClose = () => {
    setOpen(false);
    markSeen();
    // Dispatch event so HomePage can show the tooltip
    window.dispatchEvent(new CustomEvent('htp-closed'));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="How to play"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--color-theme-text)',
          color: 'var(--color-theme-bg)',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          padding: 0,
        }}
      >
        <HelpCircleIcon />
      </button>

      {open && <HowToPlayModal onClose={handleClose} />}
    </>
  );
}

export function PicksTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      try {
        if (localStorage.getItem(TOOLTIP_KEY)) return;
      } catch {}
      setVisible(true);
    };
    window.addEventListener('htp-closed', show);
    return () => window.removeEventListener('htp-closed', show);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(TOOLTIP_KEY, '1'); } catch {}
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        animation: 'fade-in-up 0.3s ease-out both',
        marginBottom: 4,
      }}
    >
      {/* Tooltip body */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--color-wins)',
          borderRadius: 10,
          padding: '10px 36px 10px 14px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.4,
          color: '#000000',
          margin: 0,
        }}>
          Make your first pick to start your streak!
        </p>

        {/* X close button */}
        <button
          onClick={dismiss}
          aria-label="Dismiss tooltip"
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(0,0,0,0.15)',
            color: '#000000',
            fontSize: 14,
            lineHeight: 1,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          &times;
        </button>
      </div>

      {/* Caret pointing down */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid var(--color-wins)',
          marginLeft: 20,
        }}
      />
    </div>
  );
}

function HowToPlayModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sync dots with scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.clientWidth;
      const idx = Math.round(scrollLeft / cardWidth);
      setCurrent(Math.min(idx, cards.length - 1));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (idx: number) => {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const isLast = current === cards.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 340,
          margin: '0 16px',
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'var(--color-theme-surface)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 8px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, fontWeight: 900, margin: 0 }}>
            HOW TO PLAY
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-theme-text-tertiary)',
              fontSize: 22,
              cursor: 'pointer',
              padding: '0 0 0 8px',
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>

        {/* Swipeable cards */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="scrollbar-hide"
        >
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                flex: '0 0 100%',
                scrollSnapAlign: 'center',
                padding: '12px 24px 20px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{card.icon}</div>
              <h3 style={{
                fontFamily: 'var(--font-title)',
                fontSize: 20,
                fontWeight: 700,
                margin: '0 0 8px',
                lineHeight: 1.2,
              }}>
                {card.headline}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'var(--color-theme-text-secondary)',
                margin: 0,
                whiteSpace: 'pre-line',
              }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Dots + action */}
        <div style={{ padding: '8px 24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {/* Dots */}
          <div style={{ display: 'flex', gap: 6 }}>
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to card ${i + 1}`}
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  backgroundColor: i === current ? 'var(--color-streak)' : 'var(--color-theme-text-muted)',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                scrollTo(current + 1);
              }
            }}
            className="htp-cta"
            style={{
              width: '100%',
              height: 40,
              borderRadius: 100,
              border: 'none',
              fontFamily: 'var(--font-title)',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.02em',
              cursor: 'pointer',
            }}
          >
            {isLast ? 'LET\'S GO' : 'NEXT'}
          </button>
        </div>
      </div>
    </div>
  );
}
