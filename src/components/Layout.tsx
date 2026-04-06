import { NavLink, Link, Outlet } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import PickResult from './PickResult';
import ActivePickBanner from './ActivePickBanner';
import { HowToPlayButton } from './HowToPlay';
import { PersonIcon } from './icons';

const tabs = [
  { to: '/', label: 'HOME' },
  { to: '/groups', label: 'GROUPS' },
  { to: '/leaderboard', label: 'LEADERS' },
  { to: '/rewards', label: 'REWARDS' },
];

function NativeStatusBar() {
  return (
    <div className="native-status-bar flex items-end justify-between h-[44px] px-[27px] pb-[7px] mb-[-1px]">
      {/* Time */}
      <span className="native-status-text" style={{ fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif', fontSize: 17, fontWeight: 600, letterSpacing: -0.41, lineHeight: '22px' }}>
        9:41
      </span>
      {/* Signal indicators */}
      <div className="flex items-center gap-[7px]">
        {/* Cellular */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" className="native-status-icon" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" className="native-status-icon" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" className="native-status-icon" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" className="native-status-icon" />
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 11.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" className="native-status-icon" />
          <path d="M4.7 7.8a4.7 4.7 0 016.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="native-status-stroke" />
          <path d="M2.3 5.3a8 8 0 0111.4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="native-status-stroke" />
          <path d="M.2 2.8a11 11 0 0115.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="native-status-stroke" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="2" stroke="currentColor" strokeWidth="1" className="native-status-stroke" style={{ opacity: 0.35 }} />
          <rect x="2" y="2" width="19" height="9" rx="1" className="native-status-icon" />
          <path d="M24 4.5c.8.3 1.5 1 1.5 2s-.7 1.7-1.5 2" className="native-status-stroke" style={{ opacity: 0.4 }} />
        </svg>
      </div>
    </div>
  );
}

export default function Layout() {
  const streak = useGameStore((s) => s.weeklyStreak);

  return (
    <div
      className="app-shell relative flex flex-col transition-colors duration-200"
      style={{ backgroundColor: 'var(--color-theme-bg)', color: 'var(--color-theme-text)', height: '100%' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40">
        {/* iOS native status bar */}
        <NativeStatusBar />

        <div className="header-bar flex items-center justify-center relative h-12 px-4">
          <div className="absolute left-4 flex items-center gap-1.5 header-streak-pill px-2.5 py-1 rounded-full">
            <span className="text-xs font-bold tabular-nums font-title header-text">{streak}</span>
          </div>
          <h1 className="font-display text-[20px] leading-[26px] font-black italic tracking-tight header-text">
            STREAK <span className="font-display font-black italic">FOR THE BONUS</span>
          </h1>
          <Link to="/profile" className="absolute right-4 header-text">
            <PersonIcon size={24} />
          </Link>
        </div>

        {/* Tab Nav */}
        <nav
          className="flex shadow-[0px_1px_4px_0px_rgba(16,17,19,0.24)] transition-colors duration-200"
          style={{ backgroundColor: 'var(--color-theme-nav-bg)' }}
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex-1 relative flex items-center justify-center h-11 text-[12px] leading-[14px] tracking-[0.02em] font-body transition-colors ${
                  isActive ? '' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? '#CFFF18' : 'var(--color-theme-nav-inactive)',
              })}
            >
              {({ isActive }) => (
                <>
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-sm" style={{ backgroundColor: '#CFFF18' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          <Outlet />
        </div>
      </main>

      {/* How to play FAB — positioned over the app shell, not in scroll flow */}
      <HowToPlayButton />

      {/* Active pick toast */}
      <ActivePickBanner />

      {/* Pick result overlay */}
      <PickResult />
    </div>
  );
}
