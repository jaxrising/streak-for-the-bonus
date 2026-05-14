import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LeaderboardPage from './pages/LeaderboardPage';
import RewardsPage from './pages/RewardsPage';
import ProfilePage from './pages/ProfilePage';
import LoginScreen from './components/LoginScreen';
import { useAuthStore, initAuth } from './store/authStore';
import { useGameStore } from './store/gameStore';

const USE_FIREBASE = import.meta.env.VITE_USE_FIREBASE === 'true';

type Theme = 'dark' | 'light';

export default function App() {
  const [theme] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem('streak-theme');
      if (v === 'light' || v === 'dark') return v;
    } catch {}
    return 'dark';
  });

  const { user, loading, initialized } = useAuthStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (USE_FIREBASE) {
      initAuth();
    }
  }, []);

  useEffect(() => {
    if (USE_FIREBASE && user) {
      useGameStore.getState().setUser(user.uid);
    } else if (USE_FIREBASE && !user && initialized) {
      useGameStore.getState().setUser(null);
    }
  }, [user, initialized]);

  if (USE_FIREBASE && loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#101113' }}
      >
        <div className="w-8 h-8 border-2 border-[#FFDA18] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (USE_FIREBASE && (!user || !user.username)) {
    return <LoginScreen />;
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
