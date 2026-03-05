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
  image,
  color,
  watermark,
  isHeadshot,
  isSelected,
  isDisabled,
  onClick,
}: {
  label: string;
  shortLabel?: string;
  abbrLabel?: string;
  odds?: string;
  image?: string;
  color?: string;
  watermark?: string;
  isHeadshot: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative flex items-center h-[52px] rounded-lg overflow-hidden text-sm font-semibold font-title transition-all duration-200 disabled:cursor-not-allowed ${
        isSelected ? 'ring-2' : ''
      }`}
      style={{
        backgroundColor: 'var(--color-theme-surface-alt)',
        color: isSelected ? 'var(--color-theme-text)' : 'var(--color-theme-text-secondary)',
        ...(isSelected ? { '--tw-ring-color': '#3772DF' } as React.CSSProperties : {}),
      }}
    >
      {/* Glow container — glow fades naturally, no hard clip */}
      {color && (
        <div className="absolute left-0 top-0 bottom-0 w-[83px] shrink-0 pointer-events-none">
          <div className="absolute left-0 top-0 bottom-0 w-[120px]" style={{ maskImage: 'linear-gradient(to right, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 50%, transparent 100%)' }}>
            {/* Radial color glow — 4 layers, origin top-left */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 0% 0%, ${color} 0%, transparent 70%)`,
                opacity: 0.6,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 10% 10%, ${color} 0%, transparent 60%)`,
                opacity: 0.4,
              }}
            />
            <div
              className="absolute"
              style={{
                inset: isHeadshot ? '-73.33% -36.67%' : '-44% -22%',
                background: `radial-gradient(ellipse at 30% 30%, ${color} 0%, transparent 60%)`,
                opacity: 0.3,
              }}
            />
            <div
              className="absolute"
              style={{
                inset: isHeadshot ? '-40% -20%' : '-24% -12%',
                background: `radial-gradient(ellipse at 25% 25%, ${color} 0%, transparent 50%)`,
                opacity: 0.2,
              }}
            />

            {/* Watermark at 8% opacity — flag for headshots, team logo otherwise */}
            {(watermark || image) && (
              <div
                className="absolute opacity-[0.08]"
                style={{ inset: '-24.51% 40% -22.55% -15%' }}
              >
                <img src={watermark || image} alt="" className="w-full h-full object-contain" />
              </div>
            )}

            {/* Main image */}
            {image && isHeadshot && (
              <img
                src={image}
                alt=""
                className="absolute h-full object-cover object-top"
                style={{ inset: '0 37.1% 0 -6%' }}
              />
            )}
            {image && !isHeadshot && (
              <div className="absolute" style={{ inset: '12% 59% 12% 3%' }}>
                <img src={image} alt="" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fallback if no color */}
      {!color && image && (
        <img src={image} alt="" className="w-8 h-8 object-contain shrink-0 ml-3" />
      )}

      {/* Team name — three variants toggled by container queries */}
      <span className="relative z-10 flex-1 text-left pl-[52px] min-w-0">
        <span className="team-name-full block truncate">{label}</span>
        <span className="team-name-short block truncate">{shortLabel || label}</span>
        <span className={`team-name-abbr block ${isHeadshot ? 'truncate' : 'whitespace-nowrap'}`}>{abbrLabel || (shortLabel || label)}</span>
      </span>

      {odds && (
        <span
          className="relative z-10 text-xs font-body shrink-0 pr-3 pl-2"
          style={{ color: isSelected ? '#3772DF' : 'var(--color-theme-text-muted)' }}
        >
          {odds}
        </span>
      )}
    </button>
  );
}

export default function PickCard({ offering, index }: PickCardProps) {
  const { activePick, resolving, makePick } = useGameStore();
  const isDisabled = activePick !== null || resolving;
  const isActive = activePick?.offeringId === offering.id;
  const isHeadshot = HEADSHOT_SPORTS.has(offering.sport);

  const handlePick = (side: PickSide) => {
    if (isDisabled) return;
    makePick(offering, side);
  };

  return (
    <div
      className={`pick-card-container border rounded-xl p-4 transition-all duration-300 animate-fade-in-up ${
        isActive
          ? 'shadow-[0_0_20px_rgba(55,114,223,0.3)]'
          : isDisabled
          ? 'opacity-50'
          : ''
      }`}
      style={{
        animationDelay: `${index * 60}ms`,
        backgroundColor: 'var(--color-theme-surface)',
        borderColor: isActive ? '#3772DF' : 'var(--color-theme-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SportIcon sport={offering.sport} />
        <span className="text-xs font-medium uppercase font-title" style={{ color: 'var(--color-theme-text-tertiary)' }}>{offering.league}</span>
        <span className="ml-auto text-xs" style={{ color: 'var(--color-theme-text-muted)' }}>{offering.startTime}</span>
      </div>

      <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-theme-text-secondary)' }}>{offering.question}</p>

      <div className="grid grid-cols-1 gap-2">
        <PickButton
          label={offering.optionA}
          shortLabel={offering.shortA}
          abbrLabel={offering.abbrA}
          odds={offering.oddsA}
          image={offering.imageA}
          color={offering.colorA}
          watermark={offering.watermarkA}
          isHeadshot={isHeadshot}
          isSelected={isActive && activePick?.side === 'A'}
          isDisabled={isDisabled}
          onClick={() => handlePick('A')}
        />
        <PickButton
          label={offering.optionB}
          shortLabel={offering.shortB}
          abbrLabel={offering.abbrB}
          odds={offering.oddsB}
          image={offering.imageB}
          color={offering.colorB}
          watermark={offering.watermarkB}
          isHeadshot={isHeadshot}
          isSelected={isActive && activePick?.side === 'B'}
          isDisabled={isDisabled}
          onClick={() => handlePick('B')}
        />
      </div>
    </div>
  );
}
