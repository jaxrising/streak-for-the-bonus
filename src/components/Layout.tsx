import { NavLink, Link, Outlet } from 'react-router-dom';
import { HowToPlayButton } from './HowToPlay';
import SubmitPickBar from './SubmitPickBar';
import { PersonIcon } from './icons';


const tabs = [
  { to: '/', label: 'HOME' },
  { to: '/groups', label: 'GROUPS' },
  { to: '/leaderboard', label: 'LEADERS' },
  { to: '/rewards', label: 'REWARDS' },
];

const videoSrc = new URL('../assets/Streak_video.mp4', import.meta.url).href;
const logoSrc = new URL('../assets/Streak Logo.png', import.meta.url).href;
const logoSmallSrc = new URL('../assets/Streak Small Logo.png', import.meta.url).href;
const adSrc = new URL('../assets/Streak_ad.jpeg', import.meta.url).href;

const globalNavSports = ['NFL', 'Soccer', 'NBA', 'MLB', 'NCAAF', 'NCAAM'];

const relatedGames = [
  { name: 'FIRE Soccer Group Stage', href: '#' },
  { name: 'ESPN Streak (Classic)', href: '#' },
  { name: 'NFL Pigskin Bracket', href: '#' },
  { name: 'NBA Playoffs Prediction', href: '#' },
];

const legalLinks = [
  { label: 'Official Rules', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Interest-Based Ads', href: '#' },
];

export default function Layout() {
  return (
    <div
      className="app-shell relative min-h-screen transition-colors duration-200"
      style={{ backgroundColor: 'var(--color-theme-bg)', color: 'var(--color-theme-text)' }}
    >
      {/* ESPN Global Nav + Secondary Nav — sticky */}
      <header className="sticky top-0 z-50">
        {/* ESPN Global Nav */}
        <div className="w-full h-[44px] flex items-center justify-between px-4 relative" style={{ backgroundColor: '#101113' }}>
          <div className="flex items-center gap-6">
            <span className="font-display text-[18px] font-black italic text-[#FF0000] tracking-tight">ESPN</span>
            <nav className="hidden md:flex items-center gap-6">
              {globalNavSports.map(sport => (
                <a key={sport} href="#" className="text-[14px] font-body text-white hover:text-white/80 transition-colors whitespace-nowrap">
                  {sport}
                </a>
              ))}
              <span className="text-white text-[14px] cursor-pointer">•••</span>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hidden md:flex items-center gap-1.5">
              <span className="text-[12px] font-body font-medium text-white">Watch</span>
            </a>
            <a href="#" className="hidden md:flex items-center gap-1.5">
              <span className="text-[12px] font-body font-medium text-white">Bet</span>
            </a>
            <a href="#" className="hidden md:flex items-center gap-1.5">
              <span className="text-[12px] font-body font-medium text-white">Fantasy</span>
            </a>
            <a href="#" className="hidden lg:flex items-center gap-2.5">
              <span className="text-[14px] font-body text-white">Where to Watch</span>
            </a>
            <button className="text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <Link to="/profile" className="text-white">
              <PersonIcon size={20} />
            </Link>
          </div>
        </div>

        {/* Secondary Nav */}
        <div className="w-full h-[44px] flex items-center" style={{ backgroundColor: '#252627', boxShadow: '0px 4px 5px rgba(0,0,0,0.25)' }}>
          <div className="max-w-[1240px] mx-auto w-full flex items-center px-4">
            <img src={logoSmallSrc} alt="Streak for the Bonus" className="h-[32px] object-contain" />
            <div className="mx-4 h-[30px] w-[0.5px] bg-[#848687]" />
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-body font-medium text-white">2025</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M2 3L4 5L6 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <a href="#" className="ml-4 text-[12px] font-body font-medium text-white">All Games</a>
          </div>
        </div>
      </header>

      {/* Hero Video Banner */}
      <div className="relative w-full h-[180px] md:h-[302px] overflow-hidden bg-[#141414]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <img
            src={logoSrc}
            alt="Streak for the Bonus"
            className="h-[80px] w-[240px] md:h-[140px] md:w-[340px] object-contain mb-4 drop-shadow-lg"
          />
          <p className="text-[11px] md:text-[18px] leading-[14px] md:leading-[24px] font-body font-medium text-white/90 max-w-[340px]">
            Pick winners every day across every sport, build your streak, and unlock bonus bets from DraftKings!
          </p>
        </div>
      </div>

      {/* Game Tabs — directly below banner, no gap */}
      <nav
        className="sticky top-[88px] z-40 w-full"
        style={{ backgroundColor: '#1B1C1D' }}
      >
        <div className="max-w-[1240px] mx-auto flex">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className="flex-1 relative flex items-center justify-center h-[41px] text-[12px] leading-[14px] tracking-[0.02em] font-body font-medium transition-colors"
              style={({ isActive }) => ({
                color: isActive ? '#FFDA18' : 'rgba(255,255,255,0.6)',
              })}
            >
              {({ isActive }) => (
                <>
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[4px] rounded-t-sm" style={{ backgroundColor: '#FFDA18' }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Two-column content area */}
      <div className="max-w-[1240px] mx-auto px-[10px] py-[10px] flex flex-col md:flex-row gap-5">
        {/* Left column — main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        {/* Right sidebar */}
        <aside className="w-full md:w-[300px] shrink-0 flex flex-col gap-4">
          {/* About the Game */}
          <div
            className="rounded-lg border p-5"
            style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
          >
            <h3 className="text-[12px] leading-[14px] tracking-[0.08em] uppercase font-title font-bold mb-3" style={{ color: 'var(--color-theme-text)' }}>
              About the Game
            </h3>
            <p className="text-[14px] leading-[20px] font-body mb-3" style={{ color: 'var(--color-theme-text-secondary)' }}>
              Make daily picks across NFL, NBA, MLB, NHL, Soccer, and more. Build your win streak, earn bonus bets from DraftKings, and compete against other players on the leaderboard. The longer your streak, the bigger the reward.
            </p>
            <p className="text-[12px] leading-[16px] font-body" style={{ color: 'var(--color-theme-text-muted)' }}>
              One pick at a time. Picks lock at game start.
            </p>
          </div>

          {/* Related Games */}
          <div
            className="rounded-lg border p-5"
            style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
          >
            <h3 className="text-[12px] leading-[14px] tracking-[0.08em] uppercase font-title font-bold mb-3" style={{ color: 'var(--color-theme-text)' }}>
              Related Games
            </h3>
            <div className="flex flex-col gap-0">
              {relatedGames.map((game) => (
                <a
                  key={game.name}
                  href={game.href}
                  className="flex items-center gap-3 py-2.5 border-b last:border-b-0 transition-colors"
                  style={{ borderColor: 'var(--color-theme-border)' }}
                >
                  <div
                    className="w-8 h-8 rounded shrink-0"
                    style={{ backgroundColor: 'var(--color-theme-surface-alt)' }}
                  />
                  <span className="flex-1 text-[14px] leading-[20px] font-body font-medium" style={{ color: 'var(--color-theme-text-secondary)' }}>
                    {game.name}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-theme-text-muted)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Ad */}
          <img src={adSrc} alt="" className="w-full rounded-lg" />

          {/* Terms & Legal */}
          <div
            className="rounded-lg border p-5"
            style={{ backgroundColor: 'var(--color-theme-surface)', borderColor: 'var(--color-theme-border)' }}
          >
            <h3 className="text-[12px] leading-[14px] tracking-[0.08em] uppercase font-title font-bold mb-3" style={{ color: 'var(--color-theme-text)' }}>
              Terms of Use
            </h3>
            <div className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[14px] leading-[20px] font-body transition-colors"
                  style={{ color: 'var(--color-theme-text-secondary)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="text-[11px] leading-[14px] font-body mt-4" style={{ color: 'var(--color-theme-text-muted)' }}>
              &copy; 2026 ESPN Enterprises, LLC. All rights reserved.
            </p>
          </div>
        </aside>
      </div>

      {/* How to play FAB */}
      <HowToPlayButton />

      {/* Submit pick sticky bar */}
      <SubmitPickBar />
    </div>
  );
}
