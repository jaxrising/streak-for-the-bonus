import { useSyncExternalStore } from 'react';
import type { Sport } from '../types';

const logos: Record<Sport, { light: string; dark: string; alt: string }> = {
  NFL: {
    light: 'https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png',
    dark: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/nfl.png',
    alt: 'NFL',
  },
  NBA: {
    light: 'https://a.espncdn.com/i/teamlogos/leagues/500/nba.png',
    dark: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/nba.png',
    alt: 'NBA',
  },
  NHL: {
    light: 'https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png',
    dark: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/nhl.png',
    alt: 'NHL',
  },
  MLB: {
    light: 'https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png',
    dark: 'https://a.espncdn.com/i/teamlogos/leagues/500-dark/mlb.png',
    alt: 'MLB',
  },
  Soccer: {
    light: 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png',
    dark: 'https://a.espncdn.com/i/leaguelogos/soccer/500-dark/23.png',
    alt: 'EPL',
  },
  Golf: {
    light: 'https://a.espncdn.com/i/espn/misc_logos/500/pga_tour.png',
    dark: 'https://a.espncdn.com/i/espn/misc_logos/500-dark/pga_tour.png',
    alt: 'PGA',
  },
};

function getTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function subscribeTheme(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export default function SportIcon({ sport, className = '' }: { sport: Sport; className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme);
  const logo = logos[sport];
  const src = theme === 'dark' ? logo.dark : logo.light;
  return (
    <img
      src={src}
      alt={logo.alt}
      className={`w-5 h-5 object-contain ${className}`}
    />
  );
}
