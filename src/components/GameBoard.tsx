import React from 'react';
import { TileData } from '../types/game';
import { AlertOctagon, Sparkles, Bomb, Zap } from 'lucide-react';

interface GameBoardProps {
  rows: number;
  cols: number;
  tiles: (TileData | null)[][];
  selectedTileIds: Set<string>;
  onTileClick: (tile: TileData) => void;
  isNearDanger: boolean;
  isCriticalDanger: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  rows,
  cols,
  tiles,
  selectedTileIds,
  onTileClick,
  isNearDanger,
  isCriticalDanger,
}) => {
  // Color styling based on number value for rapid visual cognition
  const getTileColor = (value: number, isSelected: boolean, isHinted: boolean) => {
    if (isSelected) {
      return 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black border-amber-300 shadow-md shadow-amber-500/40 ring-2 ring-amber-300 scale-95';
    }
    if (isHinted) {
      return 'bg-gradient-to-b from-yellow-500/30 to-amber-600/30 text-amber-200 border-amber-400 ring-2 ring-amber-400/80 animate-pulse';
    }

    // Number tier coloring (anti-slop, clean, high contrast)
    if (value <= 3) {
      return 'bg-slate-800/90 hover:bg-slate-700/90 text-sky-300 border-sky-500/20 hover:border-sky-400/50 shadow-xs';
    } else if (value <= 6) {
      return 'bg-slate-800/90 hover:bg-slate-700/90 text-emerald-300 border-emerald-500/20 hover:border-emerald-400/50 shadow-xs';
    } else if (value <= 9) {
      return 'bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border-amber-500/20 hover:border-amber-400/50 shadow-xs';
    } else {
      return 'bg-slate-800/90 hover:bg-slate-700/90 text-purple-300 border-purple-500/20 hover:border-purple-400/50 shadow-xs';
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-2 select-none">
      {/* Danger Ceiling Line (Red Zone Indicator) */}
      <div className="relative mb-2">
        <div
          className={`flex items-center justify-between px-3 py-1 rounded-md text-[11px] font-mono tracking-wider uppercase transition-colors border ${
            isCriticalDanger
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-danger-pulse shadow-md shadow-rose-950'
              : isNearDanger
              ? 'bg-amber-950/60 border-amber-500/80 text-amber-300 shadow-sm'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <AlertOctagon className={`w-3.5 h-3.5 ${isCriticalDanger ? 'text-rose-400' : isNearDanger ? 'text-amber-400' : 'text-slate-600'}`} />
            <span>{isCriticalDanger ? '触顶极度危险！即将游戏结束' : isNearDanger ? '触顶预警区域' : '顶部警戒线'}</span>
          </div>
          <span className="text-[10px] opacity-75">LIMIT CEILING</span>
        </div>

        {/* Hazard strip visual line */}
        <div
          className={`h-1 w-full mt-1 rounded-full transition-colors ${
            isCriticalDanger
              ? 'bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600 animate-pulse'
              : isNearDanger
              ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600'
              : 'bg-slate-800'
          }`}
        />
      </div>

      {/* The Game Grid Container */}
      <div className="relative p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-sm">
        {/* Ambient grid background cells for empty slots */}
        <div
          className="grid gap-1.5 sm:gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }).map((_, rIdx) =>
            Array.from({ length: cols }).map((_, cIdx) => {
              const tile = tiles[rIdx]?.[cIdx];
              const isSelected = tile ? selectedTileIds.has(tile.id) : false;
              const isDangerRow = rIdx === 0;

              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  className="relative aspect-square w-full flex items-center justify-center rounded-xl overflow-hidden"
                >
                  {/* Ghost cell background */}
                  <div
                    className={`absolute inset-0 rounded-xl border transition-colors ${
                      isDangerRow
                        ? 'border-rose-900/40 bg-rose-950/10'
                        : 'border-slate-800/60 bg-slate-950/40'
                    }`}
                  />

                  {/* Tile item if present */}
                  {tile && (
                    <button
                      type="button"
                      onClick={() => onTileClick(tile)}
                      disabled={tile.isClearing}
                      className={`relative w-full h-full rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 ${getTileColor(
                        tile.value,
                        isSelected,
                        !!tile.isHinted
                      )} ${
                        tile.isClearing ? 'scale-0 opacity-0 duration-200' : 'scale-100 opacity-100'
                      }`}
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {/* Special tile badge */}
                      {tile.isSpecial && (
                        <div className="absolute top-1 right-1">
                          {tile.isSpecial === 'bomb' && (
                            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-rose-500 text-white shadow-xs">
                              <Bomb className="w-2.5 h-2.5" />
                            </span>
                          )}
                          {tile.isSpecial === 'multiplier' && (
                            <span className="flex items-center justify-center px-1 rounded-sm bg-amber-400 text-slate-950 text-[9px] font-black shadow-xs">
                              2X
                            </span>
                          )}
                          {tile.isSpecial === 'freeze' && (
                            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-sky-400 text-slate-950 text-[9px] font-black shadow-xs">
                              ❄
                            </span>
                          )}
                        </div>
                      )}

                      {/* Number Text */}
                      <span className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
                        {tile.value}
                      </span>

                      {/* Visual indicator when selected */}
                      {isSelected && (
                        <div className="absolute -bottom-0.5 inset-x-2 h-0.5 bg-slate-950/40 rounded-full" />
                      )}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
