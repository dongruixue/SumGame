import React from 'react';
import { X, Trophy, Flame, Target, Award, RotateCcw } from 'lucide-react';
import { GameStats } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">战绩成就</h3>
              <p className="text-xs text-slate-400">本地历史统计数据</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="关闭统计"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mt-4 space-y-2.5 font-mono-numbers">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-sans text-slate-300">经典模式最高分</span>
            </div>
            <span className="text-base font-bold text-amber-400">
              {stats.highScoreClassic.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-sans text-slate-300">计时模式最高分</span>
            </div>
            <span className="text-base font-bold text-sky-400">
              {stats.highScoreTime.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-sans text-slate-300">历史最高连击</span>
            </div>
            <span className="text-base font-bold text-rose-300">
              {stats.maxCombo}x COMBO
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-sans text-slate-300">累计求和消除</span>
            </div>
            <span className="text-base font-bold text-emerald-400">
              {stats.clearedSetsCount} 组
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-sans text-slate-400">总游玩局数</span>
            <span className="text-sm font-semibold text-slate-300">
              {stats.gamesPlayed} 局
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetStats}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重置统计</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
