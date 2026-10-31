import React from 'react';
import { TileData } from '../types/game';
import { Bomb, Sparkles, Snowflake } from 'lucide-react';

interface CarrotTileProps {
  tile: TileData;
  isSelected: boolean;
  isHinted: boolean;
  onClick: () => void;
}

export const CarrotTile: React.FC<CarrotTileProps> = ({
  tile,
  isSelected,
  isHinted,
  onClick,
}) => {
  // Vibrant carrot gradient styles
  const getCarrotColors = (val: number, selected: boolean, hinted: boolean) => {
    if (selected) {
      return {
        body: 'from-amber-400 via-orange-400 to-amber-500',
        border: 'border-yellow-200 ring-4 ring-yellow-400/90 shadow-lg shadow-orange-500/50 scale-95 z-20',
        leaves: '#15803d',
        text: 'text-amber-950',
        leafGlow: 'drop-shadow(0 0 4px #22c55e)',
      };
    }
    if (hinted) {
      return {
        body: 'from-orange-400 via-amber-400 to-orange-500',
        border: 'border-amber-300 ring-2 ring-amber-400 animate-pulse shadow-md shadow-amber-500/40',
        leaves: '#16a34a',
        text: 'text-amber-950',
        leafGlow: 'drop-shadow(0 0 6px #eab308)',
      };
    }

    // Different value tiers have subtle juicy carrot tones
    if (val <= 3) {
      return {
        body: 'from-orange-400 to-orange-500',
        border: 'border-orange-300/40 hover:border-orange-300 shadow-sm',
        leaves: '#22c55e',
        text: 'text-white',
        leafGlow: 'none',
      };
    } else if (val <= 6) {
      return {
        body: 'from-orange-500 to-amber-600',
        border: 'border-orange-400/40 hover:border-orange-300 shadow-sm',
        leaves: '#16a34a',
        text: 'text-white',
        leafGlow: 'none',
      };
    } else {
      return {
        body: 'from-orange-600 to-red-500',
        border: 'border-orange-400/50 hover:border-amber-300 shadow-sm',
        leaves: '#15803d',
        text: 'text-white',
        leafGlow: 'none',
      };
    }
  };

  const style = getCarrotColors(tile.value, isSelected, !!tile.isHinted);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={tile.isClearing}
      className={`group relative w-full h-full rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 select-none ${
        tile.isClearing ? 'scale-0 opacity-0 duration-200' : 'scale-100 opacity-100'
      } ${style.border}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
      aria-label={`胡萝卜数字 ${tile.value}`}
    >
      {/* Carrot Graphic Body */}
      <div className="absolute inset-0.5 sm:inset-1 rounded-xl sm:rounded-2xl overflow-hidden flex flex-col items-center">
        {/* Carrot Leaves (Top Foliage) */}
        <div
          className="relative -top-1 sm:-top-1.5 z-10 flex items-center justify-center h-3 sm:h-4 w-full transition-transform group-hover:scale-110"
          style={{ filter: style.leafGlow }}
        >
          <svg viewBox="0 0 36 16" className="w-6 sm:w-8 h-3 sm:h-4" fill="none">
            {/* Center leaf */}
            <path
              d="M18 15 C17 8 16 2 18 1 C20 2 19 8 18 15 Z"
              fill={style.leaves}
            />
            {/* Left curved leaf */}
            <path
              d="M18 14 C14 9 9 6 6 7 C8 10 13 12 18 14 Z"
              fill={style.leaves}
              opacity="0.9"
            />
            {/* Right curved leaf */}
            <path
              d="M18 14 C22 9 27 6 30 7 C28 10 23 12 18 14 Z"
              fill={style.leaves}
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Carrot Root (Tapered orange body) */}
        <div
          className={`relative flex-1 w-full rounded-xl sm:rounded-2xl bg-gradient-to-b ${style.body} flex flex-col items-center justify-center shadow-inner overflow-hidden`}
        >
          {/* Subtle Carrot horizontal texture stripes */}
          <div className="absolute inset-0 pointer-events-none opacity-25 flex flex-col justify-around py-1 px-1">
            <div className="w-1/3 h-0.5 bg-orange-950 rounded-full self-start" />
            <div className="w-2/5 h-0.5 bg-orange-950 rounded-full self-end" />
            <div className="w-1/4 h-0.5 bg-orange-950 rounded-full self-start ml-1" />
            <div className="w-1/3 h-0.5 bg-orange-950 rounded-full self-end mr-1" />
          </div>

          {/* Glossy light reflection on carrot shoulder */}
          <div className="absolute top-1 left-2 w-2 h-4 bg-white/20 rounded-full blur-[0.5px] transform -rotate-12 pointer-events-none" />

          {/* Carrot Number Value */}
          <div className="relative z-10 flex items-center justify-center">
            <span
              className={`text-xl sm:text-2xl font-display font-black tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
                isSelected ? 'text-amber-950 scale-110' : style.text
              }`}
            >
              {tile.value}
            </span>
          </div>

          {/* Selection Sparkle Indicator */}
          {isSelected && (
            <div className="absolute bottom-1 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs animate-ping" />
            </div>
          )}
        </div>
      </div>

      {/* Special Tile Badges */}
      {tile.isSpecial && (
        <div className="absolute -top-1 -right-1 z-20">
          {tile.isSpecial === 'bomb' && (
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-rose-600 text-white shadow-md border border-white">
              <Bomb className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
          )}
          {tile.isSpecial === 'multiplier' && (
            <span className="flex items-center justify-center px-1 py-0.5 rounded-md bg-yellow-400 text-amber-950 text-[9px] font-black shadow-md border border-white">
              2X
            </span>
          )}
          {tile.isSpecial === 'freeze' && (
            <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-400 text-white shadow-md border border-white">
              <Snowflake className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
          )}
        </div>
      )}
    </button>
  );
};
