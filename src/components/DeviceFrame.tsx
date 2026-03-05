import { useState, useEffect, useRef, type ReactNode } from 'react';

type Device = 'mobile' | 'tablet' | 'desktop';

interface FrameSpec {
  w: number;
  h: number;
  border: number;
  radius: number;
  hasNotch: boolean;
  hasStand: boolean;
}

const frameSpecs: Record<Device, FrameSpec> = {
  mobile:  { w: 390, h: 844,  border: 10, radius: 44, hasNotch: true,  hasStand: false },
  tablet:  { w: 820, h: 1180, border: 12, radius: 20, hasNotch: false, hasStand: false },
  desktop: { w: 1440, h: 900, border: 6,  radius: 8,  hasNotch: false, hasStand: true },
};

const CANVAS_PADDING = 40;
const STAND_NECK_H = 20;
const STAND_BASE_H = 6;
const STAND_TOTAL = STAND_NECK_H + STAND_BASE_H;

const BOX_SHADOW = '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px #444';

export default function DeviceFrame({ device, children }: { device: Device; children: ReactNode }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const spec = frameSpecs[device];
  const outerW = spec.w + spec.border * 2;
  const outerH = spec.h + spec.border * 2;
  const totalH = outerH + (spec.hasStand ? STAND_TOTAL : 0);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const calc = () => {
      const rect = el.getBoundingClientRect();
      const availW = rect.width - CANVAS_PADDING * 2;
      const availH = rect.height - CANVAS_PADDING * 2;
      const s = Math.min(availW / outerW, availH / totalH, 1);
      setScale(Math.max(s, 0.1));
    };

    const observer = new ResizeObserver(calc);
    observer.observe(el);
    calc();

    return () => observer.disconnect();
  }, [outerW, totalH]);

  return (
    <div
      ref={canvasRef}
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Space holder — takes up the exact visual size after scaling */}
      <div style={{ width: outerW * scale, height: totalH * scale }}>
        {/* Scaled group — everything inside renders at native resolution */}
        <div
          style={{
            width: outerW,
            height: totalH,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Frame shell */}
          <div
            style={{
              width: outerW,
              height: outerH,
              border: `${spec.border}px solid #333`,
              borderRadius: spec.radius,
              boxShadow: BOX_SHADOW,
              overflow: 'hidden',
              clipPath: 'inset(0 round ' + spec.radius + 'px)',
              position: 'relative',
              boxSizing: 'border-box',
              background: '#000',
            }}
          >
            {/* Mobile notch */}
            {spec.hasNotch && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 120,
                  height: 28,
                  background: '#222',
                  borderRadius: '0 0 16px 16px',
                  zIndex: 10,
                }}
              />
            )}

            {/* App content at native device resolution — scrolls internally */}
            <div
              style={{
                width: spec.w,
                height: spec.h,
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'relative',
              }}
            >
              {children}
            </div>
          </div>

          {/* Desktop monitor stand */}
          {spec.hasStand && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Neck */}
              <div
                style={{
                  width: 80,
                  height: STAND_NECK_H,
                  background: '#333',
                }}
              />
              {/* Base */}
              <div
                style={{
                  width: 120,
                  height: STAND_BASE_H,
                  background: '#2a2a2a',
                  borderRadius: '0 0 4px 4px',
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
