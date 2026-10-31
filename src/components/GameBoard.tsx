import React, { useMemo } from 'react';
import { TileData } from '../types/game';
import { CarrotTile } from './CarrotTile';
import { BunnyCeiling } from './BunnyCeiling';

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
  // Compute column heights (how close carrots are to the bunny mouths at row 0)
  const columnHeights = useMemo(() => {
    const heights: number[] = Array(cols).fill(0);
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        if (tiles[r]?.[c] !== null) {
          heights[c] = rows - r; // e.g. row 0 => 8, row 1 => 7
          break;
        }
      }
    }
    return heights;
  }, [rows, cols, tiles]);

  return (
    <div className="relative w-full max-w-xl mx-auto px-3 sm:px-4 py-1 select-none">
      {/* 🐰 The Bunnies With Mouths Wide Open waiting at the top */}
      <BunnyCeiling
        cols={cols}
        columnHeights={columnHeights}
        isCriticalDanger={isCriticalDanger}
        isNearDanger={isNearDanger}
      />

      {/* The Game Grid Container */}
      <div className="relative p-2 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-sm">
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
              const isBunnyMouthRow = rIdx === 0; // Top row: Bunny's open mouth zone

              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  className="relative aspect-square w-full flex items-center justify-center rounded-xl overflow-visible"
                >
                  {/* Cell Background Styling */}
                  <div
                    className={`absolute inset-0 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center ${
                      isBunnyMouthRow
                        ? 'border-dashed border-rose-400/40 bg-rose-950/20 shadow-inner'
                        : 'border-slate-800/60 bg-slate-950/40'
                    }`}
                  >
                    {/* Cute Bunny mouth suction zone icon in row 0 */}
                    {isBunnyMouthRow && !tile && (
                      <div className="flex flex-col items-center opacity-30 select-none pointer-events-none">
                        <span className="text-xs sm:text-sm">🐰</span>
                        <span className="text-[9px] text-rose-300 font-mono tracking-tighter -mt-0.5">
                          兔嘴区
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Carrot Tile with numbers & green leafy tops */}
                  {tile && (
                    <CarrotTile
                      tile={tile}
                      isSelected={isSelected}
                      isHinted={!!tile.isHinted}
                      onClick={() => onTileClick(tile)}
                    />
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
