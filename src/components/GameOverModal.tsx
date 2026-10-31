import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Trophy, Sparkles, Flame, Target } from 'lucide-react';
import { GameMode } from '../types/game';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHigh: boolean;
  clearedCount: number;
  maxCombo: number;
  mode: GameMode;
  onPlayAgain: () => void;
  onSwitchMode: (mode: GameMode) => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  isNewHigh,
  clearedCount,
  maxCombo,
  mode,
  onPlayAgain,
  onSwitchMode,
}) => {
  useEffect(() => {
    if (isOpen && isNewHigh && score > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen, isNewHigh, score]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center">
        {/* Cute Rabbit eating carrot icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-orange-500/30 flex flex-col items-center justify-center mb-3 shadow-inner">
          <span className="text-4xl animate-bounce">🐰</span>
          <span className="text-xl -mt-2">🥕</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
          {isNewHigh ? '🎉 刷新最高纪录！' : '嗷呜！胡萝卜被小兔吃掉啦'}
        </h2>
        <p className="text-xs text-orange-300/80 mt-1">
          胡萝卜碰进了小兔子的嘴巴 · 游戏结束
        </p>

        {/* Score Display Card */}
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            最终得分
          </span>
          <span className="text-4xl font-display font-black text-amber-400 mt-0.5 font-mono-numbers">
            {score.toLocaleString()}
          </span>

          {isNewHigh && (
            <div className="mt-1 text-xs text-amber-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>新历史最佳！超越原纪录</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-left">
          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400">消除胡萝卜组合</span>
            <span className="text-base font-bold text-slate-200 font-mono-numbers flex items-center gap-1 mt-0.5">
              <Target className="w-3.5 h-3.5 text-orange-400" />
              {clearedCount} 次
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col">
            <span className="text-[10px] text-slate-400">最高连击</span>
            <span className="text-base font-bold text-slate-200 font-mono-numbers flex items-center gap-1 mt-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {maxCombo}x COMBO
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再来一局保卫胡萝卜</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchMode(mode === 'classic' ? 'time' : 'classic')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
          >
            切换至 {mode === 'classic' ? '计时挑战模式' : '经典模式'}
          </button>
        </div>
      </div>
    </div>
  );
};
