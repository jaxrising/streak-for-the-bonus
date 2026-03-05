import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DeviceController, { PANEL_WIDTH } from './components/DeviceController';
import DeviceFrame from './components/DeviceFrame';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';

type Device = 'mobile' | 'tablet' | 'desktop';
type Theme = 'dark' | 'light';

const deviceDimensions: Record<Device, { w: number; h: number }> = {
  mobile: { w: 390, h: 844 },
  tablet: { w: 820, h: 1180 },
  desktop: { w: 1440, h: 900 },
};

function getStored<T extends string>(key: string, valid: T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v && valid.includes(v as T)) return v as T;
  } catch {}
  return fallback;
}

export default function App() {
  const [device, setDevice] = useState<Device>(() => getStored('streak-device', ['mobile', 'tablet', 'desktop'], 'desktop'));
  const [theme, setTheme] = useState<Theme>(() => getStored('streak-theme', ['dark', 'light'], 'dark'));

  const dims = deviceDimensions[device];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('streak-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('streak-device', device); } catch {}
  }, [device]);

  return (
    <>
      <DeviceController
        currentDevice={device}
        currentTheme={theme}
        currentWidth={dims.w}
        currentHeight={dims.h}
        onDeviceChange={(d) => setDevice(d)}
        onThemeChange={setTheme}
      />

      {/* Canvas area — everything right of the side panel, below the top bar */}
      <div
        style={{
          position: 'fixed',
          left: PANEL_WIDTH,
          top: 44,
          right: 0,
          bottom: 0,
          display: 'flex',
          background: '#0a0a0a',
        }}
      >
        <DeviceFrame device={device}>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/groups" element={<GroupsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DeviceFrame>
      </div>
    </>
  );
}
