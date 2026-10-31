import React from 'react';
import { GameMode, MoveStep } from '../types/game';
import { Flame, Clock, Target, AlertTriangle } from 'lucide-react';

interface HeaderHUDProps {
  mode: GameMode;
  target: number;
  selectedSteps: MoveStep[];
  currentSum: number;
  score: number;
  highScore: number;
  level: number;
  combo: number;
  timeLeft: number;
  maxTime: number;
  isNearDanger: boolean;
  onClearSelection: () => void;
}

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  mode,
  target,
  selectedSteps,
  currentSum,
  score,
  highScore,
  level,
  combo,
  timeLeft,
  maxTime,
  isNearDanger,
  onClearSelection,
}) => {
  const diff = target - currentSum;
  const isOver = currentSum > target;
  const isMatch = currentSum === target && selectedSteps.length > 0;
  const timeProgress = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));
  const isTimeCritical = mode === 'time' && timeLeft <= 3;

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 pt-1.5 pb-1 flex flex-col gap-2">
      {/* Top Stats Strip: Clean Typography */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono-numbers">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-slate-500 font-sans text-[11px]">关卡</span>
            <span className="text-slate-200 font-bold text-sm">LV.{level}</span>
          </div>
          <span className="text-slate-700" aria-hidden="true">·</span>
          <div className="flex items-baseline gap-1">
            <span className="text-slate-500 font-sans text-[11px]">最高</span>
            <span className="text-slate-300 font-semibold">{highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Live Score & Combo */}
        <div className="flex items-center gap-3">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-amber-400 font-bold animate-bounce text-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{combo}x 连击</span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-slate-500 font-sans text-[11px]">得分</span>
            <span className="text-amber-400 font-bold text-lg">{score.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Focus: Target Number Card & Countdown */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 p-3 shadow-lg shadow-black/40 overflow-hidden">
        {/* Ambient Top Glow for Danger */}
        {isNearDanger && (
          <div className="absolute inset-x-0 top-0 h-1 bg-rose-500 animate-pulse shadow-sm shadow-rose-500/50" />
        )}

        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Target Display */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex flex-col items-center justify-center w-15 h-15 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/40 shadow-inner">
              <div className="flex items-center gap-0.5 text-[9px] tracking-wider uppercase font-bold text-orange-400 -mb-0.5">
                <span>🥕</span>
                <span>目标</span>
              </div>
              <span className="text-2xl sm:text-3xl font-display font-black text-amber-400 tracking-tight">
                {target}
              </span>
            </div>

            {/* Arithmetic Formula Display */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedSteps.length === 0 ? (
                  <span className="text-xs text-slate-300">
                    点击胡萝卜凑成 <strong className="text-amber-400 font-bold text-sm">{target}</strong>，别让胡萝卜进兔嘴！
                  </span>
                ) : (
                  <div className="flex items-center gap-1 flex-wrap">
                    {selectedSteps.map((s, idx) => (
                      <React.Fragment key={s.tileId}>
                        <span className="inline-flex items-center gap-0.5 justify-center min-w-6 h-6 px-1.5 rounded-lg bg-orange-950/80 border border-orange-500/40 text-amber-200 font-black text-xs font-mono-numbers shadow-xs">
                          <span className="text-[10px]">🥕</span>
                          <span>{s.value}</span>
                        </span>
                        {idx < selectedSteps.length - 1 && (
                          <span className="text-slate-500 text-xs font-bold">+</span>
                        )}
                      </React.Fragment>
                    ))}
                    <span className="text-slate-500 text-xs font-bold">=</span>
                    <span
                      className={`text-sm font-bold font-mono-numbers px-2 py-0.5 rounded-lg border ${
                        isMatch
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : isOver
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-shake-over'
                          : 'bg-slate-800 text-slate-200 border-slate-700'
                      }`}
                    >
                      {currentSum}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Helper Text */}
              <div className="mt-1 text-[11px] flex items-center gap-1.5">
                {isMatch ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ 完美契合！胡萝卜消除中...
                  </span>
                ) : isOver ? (
                  <div className="flex items-center gap-1 text-rose-400 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    <span>超出 {Math.abs(diff)}！点击已选胡萝卜可撤回</span>
                    <button
                      onClick={onClearSelection}
                      className="ml-1 text-[10px] underline text-slate-400 hover:text-white"
                    >
                      清空
                    </button>
                  </div>
                ) : selectedSteps.length > 0 ? (
                  <span className="text-slate-400">
                    当前 <span className="text-slate-200 font-mono font-medium">{currentSum}</span> / 目标 <span className="text-amber-400 font-mono font-medium">{target}</span> · 还差 <strong className="text-amber-300 font-mono font-semibold">{diff}</strong>
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">
                    任意位置的胡萝卜皆可自由组合相加
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mode Specific Timer or Counter */}
          {mode === 'time' ? (
            <div className="flex flex-col items-end shrink-0 pl-1">
              <div className="flex items-center gap-1 mb-1">
                <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
                <span className={`text-sm sm:text-base font-bold font-mono-numbers ${isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                  {timeLeft.toFixed(1)}s
                </span>
              </div>
              <div className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 rounded-full ${
                    isTimeCritical ? 'bg-rose-500' : timeProgress < 50 ? 'bg-amber-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${timeProgress}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5">超时强制增行</span>
            </div>
          ) : (
            <div className="flex flex-col items-end shrink-0 pl-1 text-right">
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>经典生存</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">
                消除胡萝卜<br />底部升起新行
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
