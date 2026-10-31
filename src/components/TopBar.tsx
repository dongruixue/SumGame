import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, Trophy } from 'lucide-react';
import { GameMode } from '../types/game';

interface TopBarProps {
  mode: GameMode;
  onSelectMode: (m: GameMode) => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
  onOpenStats: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  mode,
  onSelectMode,
  isMuted,
  onToggleSound,
  onRestart,
  onOpenHowToPlay,
  onOpenStats,
}) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 border-b border-slate-800/80">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/20 text-slate-950 font-bold text-lg">
          🐰
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
            SumDrop
            <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              胡萝卜求和
            </span>
          </span>
        </div>
      </div>

      {/* Zone 2: Mode Selector & Guides */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => onSelectMode('classic')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              mode === 'classic'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            经典模式
          </button>
          <button
            onClick={() => onSelectMode('time')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              mode === 'time'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            计时模式
          </button>
        </div>

        <button
          onClick={onOpenHowToPlay}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors whitespace-nowrap cursor-pointer"
          title="玩法说明"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>玩法</span>
        </button>

        <button
          onClick={onOpenStats}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-md hover:bg-slate-800/60 transition-colors whitespace-nowrap cursor-pointer"
          title="战绩榜"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>战绩</span>
        </button>
      </nav>

      {/* Zone 3: Functional Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onOpenHowToPlay}
          className="sm:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="玩法说明"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenStats}
          className="sm:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="战绩榜"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
        </button>
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isMuted
              ? 'border-slate-800 text-slate-500 bg-slate-900/50 hover:bg-slate-800'
              : 'border-slate-700 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
          }`}
          title={isMuted ? '开启音效' : '静音'}
          aria-label="音效切换"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-all shadow-sm cursor-pointer"
          title="重开本局"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">重开</span>
        </button>
      </div>
    </header>
  );
};
