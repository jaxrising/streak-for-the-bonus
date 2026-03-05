import { NavLink, Outlet } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import PickResult from './PickResult';
import ActivePickBanner from './ActivePickBanner';

const tabs = [
  { to: '/', label: 'HOME' },
  { to: '/leaderboard', label: 'LEADERS' },
  { to: '/rewards', label: 'REWARDS' },
  { to: '/profile', label: 'PROFILE' },
  { to: '/link', label: 'LINK' },
];

export default function Layout() {
  const streak = useGameStore((s) => s.weeklyStreak);

  return (
    <div
      className="app-shell relative flex flex-col transition-colors duration-200"
      style={{ backgroundColor: 'var(--color-theme-bg)', color: 'var(--color-theme-text)', minHeight: '100%' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40">
        <div className="header-bar flex items-center justify-center relative h-12 px-4">
          <div className="absolute left-4 flex items-center gap-1.5 header-streak-pill px-2.5 py-1 rounded-full">
            <span className="text-xs font-bold tabular-nums font-title header-text">{streak}</span>
          </div>
          <h1 className="font-display text-[21px] font-black italic leading-none tracking-tight header-text">
            STREAK <span className="font-display font-black italic">FOR THE BONUS</span>
          </h1>
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
                `flex-1 relative flex items-center justify-center h-11 text-xs font-body tracking-wide transition-colors ${
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

      {/* Active pick toast */}
      <ActivePickBanner />

      {/* Pick result overlay */}
      <PickResult />
    </div>
  );
}
