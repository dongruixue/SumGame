import React from 'react';

interface BunnyCeilingProps {
  cols: number;
  columnHeights: number[]; // Number of carrots in each column (0 to rows)
  isCriticalDanger: boolean;
  isNearDanger: boolean;
}

export const BunnyCeiling: React.FC<BunnyCeilingProps> = ({
  cols,
  columnHeights,
  isCriticalDanger,
  isNearDanger,
}) => {
  return (
    <div className="w-full flex flex-col items-center mb-1">
      {/* Playful Banner replacing the old red warning bar */}
      <div
        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all duration-300 border mb-1.5 shadow-md ${
          isCriticalDanger
            ? 'bg-rose-950/90 border-rose-500 text-rose-200 animate-pulse ring-2 ring-rose-500/50'
            : isNearDanger
            ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-amber-950/50'
            : 'bg-slate-900/80 border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 font-medium">
          <span className="text-base animate-bounce">🐰</span>
          <span>
            {isCriticalDanger ? (
              <strong className="text-rose-300 font-bold">
                快救救胡萝卜！已经碰到小兔子的嘴唇了！
              </strong>
            ) : isNearDanger ? (
              <span className="text-amber-300">
                胡萝卜逼近兔嘴！小兔子口水都要流下来啦！
              </span>
            ) : (
              <span>贪吃小兔张大嘴巴等胡萝卜 · 碰到兔嘴游戏结束</span>
            )}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
          {isCriticalDanger ? '⚠️ 即将被吃掉' : '🥕 触碰兔嘴即淘汰'}
        </span>
      </div>

      {/* Row of 6 Cute Rabbits with Mouths Wide Open, perched directly above each column */}
      <div
        className="w-full grid gap-1.5 sm:gap-2.5 px-2.5 sm:px-3"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: cols }).map((_, cIdx) => {
          const height = columnHeights[cIdx] || 0;
          // When height >= 7, carrots have entered row 1 or row 0
          const isColCritical = height >= 8; // Reached top row (row 0)
          const isColDanger = height >= 7;   // In row 1 (very close)
          const isColApproaching = height >= 5;

          return (
            <div
              key={`bunny-${cIdx}`}
              className="relative flex flex-col items-center justify-end h-16 sm:h-20 transition-transform duration-200"
            >
              {/* Hungry speech bubble if critical */}
              {isColCritical && (
                <div className="absolute -top-4 z-20 bg-rose-500 text-white font-extrabold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full shadow-md animate-bounce whitespace-nowrap">
                  一口吃掉! 🥕
                </div>
              )}
              {isColDanger && !isColCritical && (
                <div className="absolute -top-3.5 z-20 bg-amber-500 text-slate-950 font-black text-[8px] sm:text-[9px] px-1 rounded-full shadow-sm animate-pulse whitespace-nowrap">
                  好想吃! 😋
                </div>
              )}

              {/* The Bunny Character SVG */}
              <div
                className={`relative w-full max-w-[56px] transition-all duration-200 ${
                  isColCritical
                    ? 'scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] animate-bounce'
                    : isColDanger
                    ? 'scale-105 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                    : 'drop-shadow-sm'
                }`}
              >
                <svg
                  viewBox="0 0 64 68"
                  className="w-full h-auto overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Left Bunny Ear */}
                  <g className={isColDanger ? 'animate-wiggle' : ''}>
                    <path
                      d="M 22 28 C 16 16, 12 2, 21 1 C 28 0, 29 16, 26 28 Z"
                      fill="#F8FAFC"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                    />
                    {/* Pink inside ear */}
                    <path
                      d="M 21 24 C 18 16, 16 6, 21 4 C 25 3, 26 15, 24 24 Z"
                      fill="#FDA4AF"
                    />
                  </g>

                  {/* Right Bunny Ear */}
                  <g className={isColDanger ? 'animate-wiggle' : ''}>
                    <path
                      d="M 42 28 C 48 16, 52 2, 43 1 C 36 0, 35 16, 38 28 Z"
                      fill="#F8FAFC"
                      stroke="#E2E8F0"
                      strokeWidth="1.5"
                    />
                    {/* Pink inside ear */}
                    <path
                      d="M 43 24 C 46 16, 48 6, 43 4 C 39 3, 38 15, 40 24 Z"
                      fill="#FDA4AF"
                    />
                  </g>

                  {/* Bunny Head Base */}
                  <ellipse
                    cx="32"
                    cy="42"
                    rx="22"
                    ry="20"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                  />

                  {/* Rosy Cheeks */}
                  <ellipse cx="17" cy="45" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />
                  <ellipse cx="47" cy="45" rx="4" ry="2.5" fill="#F472B6" opacity="0.6" />

                  {/* Cute Bunny Eyes */}
                  {isColCritical ? (
                    // Big excited starry/surprised eyes
                    <>
                      <circle cx="23" cy="36" r="4.5" fill="#1E293B" />
                      <circle cx="21.5" cy="34.5" r="1.5" fill="#FFFFFF" />
                      <circle cx="24.5" cy="37.5" r="0.8" fill="#FFFFFF" />
                      <circle cx="41" cy="36" r="4.5" fill="#1E293B" />
                      <circle cx="39.5" cy="34.5" r="1.5" fill="#FFFFFF" />
                      <circle cx="42.5" cy="37.5" r="0.8" fill="#FFFFFF" />
                    </>
                  ) : isColDanger ? (
                    // Excited wide-eyed expression
                    <>
                      <ellipse cx="23" cy="36" rx="3.5" ry="4" fill="#0F172A" />
                      <circle cx="22" cy="34.5" r="1.5" fill="#FFFFFF" />
                      <ellipse cx="41" cy="36" rx="3.5" ry="4" fill="#0F172A" />
                      <circle cx="40" cy="34.5" r="1.5" fill="#FFFFFF" />
                    </>
                  ) : (
                    // Cute normal friendly eyes
                    <>
                      <ellipse cx="23" cy="36" rx="3" ry="3.5" fill="#0F172A" />
                      <circle cx="22" cy="35" r="1.2" fill="#FFFFFF" />
                      <ellipse cx="41" cy="36" rx="3" ry="3.5" fill="#0F172A" />
                      <circle cx="40" cy="35" r="1.2" fill="#FFFFFF" />
                    </>
                  )}

                  {/* Bunny Cute Nose */}
                  <polygon points="30,41 34,41 32,43" fill="#FB7185" />

                  {/* Whiskers */}
                  <path d="M 12 43 L 4 41" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
                  <path d="M 12 46 L 4 47" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
                  <path d="M 52 43 L 60 41" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
                  <path d="M 52 46 L 60 47" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />

                  {/* THE WIDE OPEN MOUTH (Waiting eagerly for carrots) */}
                  {/* Mouth cavity */}
                  <path
                    d={
                      isColCritical
                        ? "M 20 48 Q 32 44 44 48 C 45 64, 19 64, 20 48 Z" // Huge open mouth!
                        : isColDanger
                        ? "M 22 48 Q 32 45 42 48 C 43 62, 21 62, 22 48 Z" // Very wide open mouth
                        : "M 24 48 Q 32 46 40 48 C 41 59, 23 59, 24 48 Z" // Nice open mouth
                    }
                    fill="#881337"
                    stroke="#4C0519"
                    strokeWidth="1.2"
                  />

                  {/* Pink Tongue inside mouth */}
                  <path
                    d={
                      isColCritical
                        ? "M 24 57 Q 32 50 40 57 C 38 64 26 64 24 57 Z"
                        : "M 26 55 Q 32 50 38 55 C 37 60 27 60 26 55 Z"
                    }
                    fill="#FB7185"
                  />

                  {/* Two Adorable Bunny Buck Teeth at the top of the open mouth */}
                  <rect
                    x="29"
                    y="47"
                    width="2.8"
                    height="4"
                    rx="0.5"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="0.5"
                  />
                  <rect
                    x="32.2"
                    y="47"
                    width="2.8"
                    height="4"
                    rx="0.5"
                    fill="#FFFFFF"
                    stroke="#E2E8F0"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              {/* Mouth Funnel Indicator pointing down to Column */}
              <div
                className={`w-3 h-1.5 mt-0.5 rounded-full transition-all duration-200 ${
                  isColCritical
                    ? 'bg-rose-500 scale-125 animate-ping'
                    : isColDanger
                    ? 'bg-amber-400 scale-110'
                    : 'bg-slate-700/60'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
