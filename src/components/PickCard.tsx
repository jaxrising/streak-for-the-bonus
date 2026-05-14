import type { Offering, PickSide } from '../types';
import { useGameStore } from '../store/gameStore';
import SportIcon from './SportIcon';

interface PickCardProps {
  offering: Offering;
  index: number;
}

const HEADSHOT_SPORTS = new Set(['Golf']);

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
        <div className="relative z-10 flex flex-col items-end shrink-0 pr-6 pl-2 gap-1">
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
  const isDisabled = submitted;
  const isHeadshot = HEADSHOT_SPORTS.has(offering.sport);

  const handlePick = (side: PickSide) => {
    if (isDisabled) return;
    selectPick(offering, side);
  };

  return (
    <div
      className={`pick-card-container border rounded-xl p-4 transition-all duration-300 animate-fade-in-up ${
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
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SportIcon league={offering.league} />
        <span className="text-[12px] leading-[14px] tracking-[0.02em] font-medium uppercase font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>{offering.league}</span>
        <span className="ml-auto text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{offering.startTime}</span>
      </div>

      <p className="text-[14px] leading-[20px] font-medium mb-4 line-clamp-2" style={{ color: 'var(--color-theme-text-secondary)' }}>{offering.question}</p>

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
          onClick={() => handlePick('B')}
        />
      </div>
    </div>
  );
}
