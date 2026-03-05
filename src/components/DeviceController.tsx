type Device = 'mobile' | 'tablet' | 'desktop';
type Theme = 'dark' | 'light';

const PANEL_WIDTH = 140;

const devices: { id: Device; label: string; width: number }[] = [
  { id: 'mobile', label: 'Mobile', width: 390 },
  { id: 'tablet', label: 'Tablet', width: 820 },
  { id: 'desktop', label: 'Desktop', width: 1440 },
];

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

const deviceIcons: Record<Device, () => React.ReactNode> = {
  mobile: PhoneIcon,
  tablet: TabletIcon,
  desktop: MonitorIcon,
};

const btnBase: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  fontSize: 12,
  fontWeight: 700,
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all 150ms ease',
  background: 'transparent',
  color: '#555',
  fontFamily: 'inherit',
};

const btnActive: React.CSSProperties = {
  background: 'rgba(255,255,255,0.1)',
  color: '#ffffff',
  borderColor: 'rgba(255,255,255,0.3)',
};

export { PANEL_WIDTH };

export default function DeviceController({
  currentDevice,
  currentTheme,
  currentWidth,
  currentHeight,
  onDeviceChange,
  onThemeChange,
}: {
  currentDevice: Device;
  currentTheme: Theme;
  currentWidth: number;
  currentHeight: number;
  onDeviceChange: (device: Device, width: number) => void;
  onThemeChange: (theme: Theme) => void;
}) {
  return (
    <>
      {/* Side panel */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          width: PANEL_WIDTH,
          background: '#111',
          borderRight: '1px solid #1e1e1e',
          padding: '24px 12px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* DEVICE section */}
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', color: '#444', letterSpacing: '0.12em', marginBottom: 10 }}>
            Device
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {devices.map((d) => {
              const Icon = deviceIcons[d.id];
              const isActive = currentDevice === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onDeviceChange(d.id, d.width)}
                  style={{ ...btnBase, ...(isActive ? btnActive : {}) }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#555';
                    }
                  }}
                >
                  <Icon />
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#1e1e1e', margin: '16px 0' }} />

        {/* THEME section */}
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', color: '#444', letterSpacing: '0.12em', marginBottom: 10 }}>
            Theme
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {([
              { id: 'dark' as Theme, label: 'Dark', Icon: MoonIcon },
              { id: 'light' as Theme, label: 'Light', Icon: SunIcon },
            ]).map(({ id, label, Icon }) => {
              const isActive = currentTheme === id;
              return (
                <button
                  key={id}
                  onClick={() => onThemeChange(id)}
                  style={{ ...btnBase, ...(isActive ? btnActive : {}) }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#555';
                    }
                  }}
                >
                  <Icon />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* VIEWPORT section */}
        <div>
          <div style={{ fontSize: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', marginBottom: 6 }}>
            Viewport
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
            {currentWidth} × {currentHeight}px
          </div>
        </div>
      </div>

      {/* Preview top bar */}
      <div
        style={{
          position: 'fixed',
          left: PANEL_WIDTH,
          right: 0,
          top: 0,
          height: 44,
          background: '#0f0f0f',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 9998,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ color: '#333' }}>Previewing:</span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>
            {devices.find((d) => d.id === currentDevice)?.label} — {currentWidth} × {currentHeight}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ffffff' }}>
          {currentTheme === 'dark' ? '🌙' : '☀️'} {currentTheme === 'dark' ? 'Dark' : 'Light'}
        </div>
      </div>
    </>
  );
}
