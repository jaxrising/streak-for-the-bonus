import { useState } from 'react';
import type { Offering, PickSide, Sport } from '../types';
import { useGameStore } from '../store/gameStore';
import SportIcon from './SportIcon';

interface PickCardProps {
  offering: Offering;
  index: number;
}

const HEADSHOT_SPORTS = new Set(['Golf']);

const UNIT_MAP: Record<Sport, string> = {
  MLB: 'runs',
  NBA: 'points',
  NFL: 'points',
  NHL: 'goals',
  Soccer: 'goals',
  WNBA: 'points',
  Golf: 'strokes',
  WWE: 'points',
};

function getSpreadTooltip(odds: string | undefined, teamName: string, sport: Sport): string | undefined {
  if (!odds) return undefined;
  const match = odds.match(/^([+-]?\d+\.?\d*)/);
  if (!match) return undefined;
  const line = parseFloat(match[1]);
  const unit = UNIT_MAP[sport] || 'points';
  if (line < 0) {
    const val = Math.ceil(Math.abs(line));
    const u = val === 1 ? unit.replace(/s$/, '') : unit;
    return `${teamName} needs to win by ${val}+ ${u}`;
  } else if (line > 0) {
    const val = Math.floor(line);
    const u = val === 1 ? unit.replace(/s$/, '') : unit;
    return `${teamName} can lose by ${val} ${u} and still cover`;
  }
  return undefined;
}

function PickButton({
  label,
  shortLabel,
  abbrLabel,
  odds,
  pickPct,
  image,
  color,
  isHeadshot,
  isSelected,
  isDisabled,
  onHoverOdds,
  onClick,
}: {
  label: string;
  shortLabel?: string;
  abbrLabel?: string;
  odds?: string;
  pickPct?: number;
  image?: string;
  color?: string;
  isHeadshot: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onHoverOdds: (hovering: boolean) => void;
  onClick: () => void;
}) {
  const muted = isDisabled && !isSelected;
  const textColor = muted ? '#6C6D6F' : '#FFFFFF';
  const subTextColor = muted ? '#6C6D6F' : '#a1a2a3';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative flex items-center h-[56px] rounded-lg overflow-hidden text-[14px] leading-[18px] font-bold font-title transition-all duration-200 disabled:cursor-not-allowed ${
        isSelected ? 'ring-2' : ''
      }`}
      style={{
        backgroundColor: '#252627',
        ...(isSelected ? { '--tw-ring-color': '#FFFFFF' } as React.CSSProperties : {}),
      }}
    >
      {/* Glow container — width scales to pick percentage after submit */}
      {color && (
        <div
          className="absolute left-0 top-0 bottom-0 shrink-0 pointer-events-none transition-all duration-700 ease-out"
          style={{ width: pickPct != null ? `${pickPct}%` : '112px' }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-full"
            style={{
              maskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent 100%)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 0% 50%, ${color} 0%, transparent 70%)`,
                opacity: 0.5,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${color}40 0%, transparent 100%)`,
                opacity: 0.4,
              }}
            />
          </div>
        </div>
      )}

      {/* Logo area — fixed 80px zone */}
      {image && !isHeadshot && (
        <div className="absolute left-[20px] top-[8px] w-[40px] h-[40px] z-10">
          <img src={image} alt="" className="w-full h-full object-contain" />
        </div>
      )}
      {image && isHeadshot && (
        <img
          src={image}
          alt=""
          className="absolute left-0 top-0 h-full w-[80px] object-cover object-top z-10"
        />
      )}
      {!color && image && !isHeadshot && (
        <div className="w-[80px] shrink-0" />
      )}

      {/* Team name — three variants toggled by container queries */}
      <span className="relative z-10 flex-1 text-left pl-[88px] min-w-0" style={{ color: textColor }}>
        <span className="team-name-full block truncate">{label}</span>
        <span className="team-name-short block truncate">{shortLabel || label}</span>
        <span className={`team-name-abbr block ${isHeadshot ? 'truncate' : 'whitespace-nowrap'}`}>{abbrLabel || (shortLabel || label)}</span>
      </span>

      {/* Stats area — right-aligned */}
      {(pickPct != null || odds) && (
        <div
          className="relative z-10 flex flex-col items-end shrink-0 pr-6 pl-2 gap-1"
          onMouseEnter={() => onHoverOdds(true)}
          onMouseLeave={() => onHoverOdds(false)}
        >
          {pickPct != null && (
            <span
              className="text-[10px] leading-[14px] font-body font-normal tabular-nums"
              style={{ color: textColor }}
            >
              {pickPct}% picked
            </span>
          )}
          {odds && (
            <div className="flex items-center gap-1">
              <span
                className="text-[12px] leading-[14px] font-body font-medium"
                style={{ color: subTextColor }}
              >
                {odds}
              </span>
            </div>
          )}
        </div>
      )}
    </button>
  );
}

export default function PickCard({ offering, index }: PickCardProps) {
  const { pendingSelection, submitted, submittedPick, selectPick } = useGameStore();
  const activeSelection = submitted ? submittedPick : pendingSelection;
  const isSelected = activeSelection?.offeringId === offering.id;
  const selectedSide = activeSelection?.side;
  const isLocked = offering.startTimeISO ? new Date(offering.startTimeISO) <= new Date() : false;
  const isDisabled = submitted || isLocked;
  const isHeadshot = HEADSHOT_SPORTS.has(offering.sport);
  const [hoveredSide, setHoveredSide] = useState<'A' | 'B' | null>(null);

  const handlePick = (side: PickSide) => {
    if (isDisabled) return;
    selectPick(offering, side);
  };

  const tooltipTextA = getSpreadTooltip(offering.oddsA, offering.shortA || offering.optionA, offering.sport);
  const tooltipTextB = getSpreadTooltip(offering.oddsB, offering.shortB || offering.optionB, offering.sport);
  const activeTooltip = hoveredSide === 'A' ? tooltipTextA : hoveredSide === 'B' ? tooltipTextB : null;

  return (
    <div
      className={`pick-card-container relative border rounded-xl p-4 transition-all duration-300 animate-fade-in-up ${
        isSelected
          ? 'shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          : isDisabled && !isSelected
          ? 'opacity-50'
          : ''
      } ${hoveredSide ? 'z-50' : ''}`}
      style={{
        animationDelay: `${index * 60}ms`,
        backgroundColor: 'var(--color-theme-surface)',
        borderColor: isSelected ? 'var(--color-theme-text)' : 'var(--color-theme-border)',
        overflow: 'visible',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SportIcon league={offering.league} />
        <span className="text-[12px] leading-[14px] tracking-[0.02em] font-medium uppercase font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>{offering.league}</span>
        <span className="ml-auto text-xs" style={{ color: isLocked ? '#ff3232' : 'var(--color-theme-text-muted)' }}>
          {isLocked ? 'Locked' : offering.startTime}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <PickButton
          label={offering.optionA}
          shortLabel={offering.shortA}
          abbrLabel={offering.abbrA}
          odds={offering.oddsA}
          pickPct={submitted ? offering.pickPctA : undefined}
          image={offering.imageA}
          color={offering.colorA}
          isHeadshot={isHeadshot}
          isSelected={isSelected && selectedSide === 'A'}
          isDisabled={isDisabled}
          onHoverOdds={(h) => setHoveredSide(h ? 'A' : null)}
          onClick={() => handlePick('A')}
        />
        <PickButton
          label={offering.optionB}
          shortLabel={offering.shortB}
          abbrLabel={offering.abbrB}
          odds={offering.oddsB}
          pickPct={submitted ? offering.pickPctB : undefined}
          image={offering.imageB}
          color={offering.colorB}
          isHeadshot={isHeadshot}
          isSelected={isSelected && selectedSide === 'B'}
          isDisabled={isDisabled}
          onHoverOdds={(h) => setHoveredSide(h ? 'B' : null)}
          onClick={() => handlePick('B')}
        />
      </div>

      {/* Tooltip — rendered at card level to avoid overflow clipping */}
      {activeTooltip && (
        <div
          className="absolute pointer-events-none"
          style={{
            zIndex: 9999,
            top: hoveredSide === 'A' ? 36 : 94,
            right: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            paddingRight: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: 'translateY(-100%)',
            }}
          >
            <div
              style={{
                backgroundColor: '#FF9151',
                borderRadius: 4,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 500,
                color: '#000000',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {activeTooltip}
            </div>
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '8px solid #FF9151',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
