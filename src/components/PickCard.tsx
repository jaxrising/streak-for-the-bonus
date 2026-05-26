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
  isHovered,
  tooltipText,
  onHoverOdds,
  onClick,
}: {
  label: string;
  shortLabel?: string;
  abbrLabel?: string;
  pickPct?: number;
  image?: string;
  color?: string;
  isHeadshot: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isHovered: boolean;
  onClick: () => void;
}) {
  const muted = isDisabled && !isSelected;
  const textColor = muted ? '#6C6D6F' : '#FFFFFF';
  const subTextColor = muted ? '#6C6D6F' : '#a1a2a3';

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative flex items-center h-[56px] rounded-lg overflow-visible text-[14px] leading-[18px] font-bold font-title transition-all duration-200 disabled:cursor-not-allowed ${
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
          className="absolute left-0 top-0 bottom-0 shrink-0 pointer-events-none transition-all duration-700 ease-out overflow-hidden rounded-lg"
          style={{ width: pickPct != null ? `${pickPct}%` : '112px' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${color}80 0%, ${color}30 40%, transparent 100%)`,
            }}
          />
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

      {/* Team name — three variants toggled by container queries */}
      <span className="relative z-10 flex-1 text-left pl-[80px] min-w-0" style={{ color: textColor }}>
        <span className="team-name-full block truncate">{label}</span>
        <span className="team-name-short block truncate">{shortLabel || label}</span>
        <span className={`team-name-abbr block ${isHeadshot ? 'truncate' : 'whitespace-nowrap'}`}>{abbrLabel || (shortLabel || label)}</span>
      </span>

      {/* Stats area — right-aligned (pick % only, no moneylines) */}
      {pickPct != null && (
        <div
          className="relative z-10 flex flex-col items-end shrink-0 pr-[24px] pl-2 gap-[4px]"
          style={{ overflow: 'visible' }}
        >
          <span
            className="text-[10px] leading-[12px] font-body font-normal tabular-nums"
            style={{ color: textColor }}
          >
            {pickPct}% picked
          </span>
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

  const handlePick = (side: PickSide) => {
    if (isDisabled) return;
    selectPick(offering, side);
  };

  return (
    <div
      className={`pick-card-container relative border rounded-xl p-4 transition-all duration-300 animate-fade-in-up ${
        isSelected
          ? 'shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          : isDisabled && !isSelected
          ? 'opacity-50'
          : ''
      }`}
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
        {isLocked ? (
          <span className="ml-auto flex items-center gap-1">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 6H9V4.5C9 2.57 7.43 1 5.5 1C3.57 1 2 2.57 2 4.5V6H1.5C0.95 6 0.5 6.45 0.5 7V12.5C0.5 13.05 0.95 13.5 1.5 13.5H9.5C10.05 13.5 10.5 13.05 10.5 12.5V7C10.5 6.45 10.05 6 9.5 6ZM5.5 10.5C4.95 10.5 4.5 10.05 4.5 9.5C4.5 8.95 4.95 8.5 5.5 8.5C6.05 8.5 6.5 8.95 6.5 9.5C6.5 10.05 6.05 10.5 5.5 10.5ZM7.5 6H3.5V4.5C3.5 3.4 4.4 2.5 5.5 2.5C6.6 2.5 7.5 3.4 7.5 4.5V6Z" fill="#006FFF"/>
            </svg>
            <span className="text-xs" style={{ color: '#006FFF' }}>Locked</span>
          </span>
        ) : (
          <span className="ml-auto text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>
            {offering.startTime}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        <PickButton
          label={offering.optionA}
          shortLabel={offering.shortA}
          abbrLabel={offering.abbrA}
          pickPct={submitted ? offering.pickPctA : undefined}
          image={offering.imageA}
          color={offering.colorA}
          isHeadshot={isHeadshot}
          isSelected={isSelected && selectedSide === 'A'}
          isDisabled={isDisabled}
          isHovered={false}
          onClick={() => handlePick('A')}
        />
        <PickButton
          label={offering.optionB}
          shortLabel={offering.shortB}
          abbrLabel={offering.abbrB}
          pickPct={submitted ? offering.pickPctB : undefined}
          image={offering.imageB}
          color={offering.colorB}
          isHeadshot={isHeadshot}
          isSelected={isSelected && selectedSide === 'B'}
          isDisabled={isDisabled}
          isHovered={false}
          onClick={() => handlePick('B')}
        />
      </div>
    </div>
  );
}
