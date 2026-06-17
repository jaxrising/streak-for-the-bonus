import { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../store/authStore';

const HIDDEN_PASSWORD = 'streak-espn-internal-2026';
const ALLOWED_DOMAIN = '@disney.com';

const logoSrc = new URL('../assets/Streak Logo.png', import.meta.url).href;

type Step = 'email' | 'username';

export default function LoginScreen() {
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>(user && !user.username ? 'username' : 'email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim().toLowerCase();
    if (!trimmed.endsWith(ALLOWED_DOMAIN)) {
      setError('Please use your @disney.com email address.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(trimmed, HIDDEN_PASSWORD);
      // If sign-in succeeds, onAuthStateChanged will handle navigation
      // (only if user has a username — otherwise App.tsx will re-render this screen on 'username' step)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        try {
          await signUpWithEmail(trimmed, HIDDEN_PASSWORD, trimmed.split('@')[0]);
          // New user — onAuthStateChanged will fire, username will be null,
          // App.tsx gates on username so we stay on LoginScreen.
          // But we also explicitly advance to username step:
          setStep('username');
        } catch (signupErr: unknown) {
          const signupCode = (signupErr as { code?: string }).code;
          if (signupCode === 'auth/email-already-in-use') {
            setError('Account exists but login failed. Contact support.');
          } else {
            setError('Something went wrong. Please try again.');
          }
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = username.trim();
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username must be 20 characters or less.');
      return;
    }

    const uid = user?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { displayName: trimmed, hasSeenHowToPlay: false }, { merge: true });

      // Update auth store so App.tsx gates pass
      useAuthStore.getState().setUser({
        uid,
        email: user.email,
        username: trimmed,
        hasSeenHowToPlay: false,
      });
    } catch (err) {
      console.error('[LoginScreen] Failed to save username:', err);
      setError('Failed to save username. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#101113' }}
    >
      <div className="w-full max-w-[360px] flex flex-col items-center">
        <img
          src={logoSrc}
          alt="Streak for the Bonus"
          className="h-[80px] w-[240px] object-contain mb-8"
        />

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="w-full flex flex-col gap-4">
            <p className="text-[14px] leading-[20px] font-body text-white/80 text-center">
              Sign in with your Disney email to play.
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@disney.com"
              autoFocus
              required
              className="w-full h-[48px] rounded-lg px-4 text-[14px] font-body text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FFDA18]"
              style={{ backgroundColor: '#252627', border: '1px solid #3A3B3C' }}
            />

            {error && (
              <p className="text-[12px] leading-[16px] font-body text-red-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-lg text-[14px] font-title font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#FFDA18', color: '#101113' }}
            >
              {loading ? 'Signing in...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 'username' && (
          <form onSubmit={handleUsernameSubmit} className="w-full flex flex-col gap-4">
            <p className="text-[14px] leading-[20px] font-body text-white/80 text-center">
              Welcome! Choose a display name.
            </p>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              autoFocus
              required
              maxLength={20}
              className="w-full h-[48px] rounded-lg px-4 text-[14px] font-body text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-[#FFDA18]"
              style={{ backgroundColor: '#252627', border: '1px solid #3A3B3C' }}
            />

            {error && (
              <p className="text-[12px] leading-[16px] font-body text-red-400 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] rounded-lg text-[14px] font-title font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#FFDA18', color: '#101113' }}
            >
              {loading ? 'Saving...' : 'Start Playing'}
            </button>
          </form>
        )}

        <p className="mt-8 text-[11px] leading-[14px] font-body text-white/40 text-center">
          Internal prototype — Disney employees only.
        </p>
      </div>
    </div>
  );
}
