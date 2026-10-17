import React from 'react';
import { Lightbulb, Bomb, ArrowUpFromLine, XCircle } from 'lucide-react';

interface ControlsBarProps {
  hintsLeft: number;
  onUseHint: () => void;
  bombCharge: number; // 0 to 100
  onUseBomb: () => void;
  onManualPushRow: () => void;
  hasSelected: boolean;
  onClearSelection: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  hintsLeft,
  onUseHint,
  bombCharge,
  onUseBomb,
  onManualPushRow,
  hasSelected,
  onClearSelection,
}) => {
  const canUseBomb = bombCharge >= 100;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
      {/* Clear Selection */}
      <button
        type="button"
        onClick={onClearSelection}
        disabled={!hasSelected}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
          hasSelected
            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 shadow-sm cursor-pointer'
            : 'bg-slate-900/40 text-slate-600 border-slate-800/40 opacity-50 cursor-not-allowed'
        }`}
        title="清空当前所有选中数字"
      >
        <XCircle className="w-3.5 h-3.5" />
        <span>清选</span>
      </button>

      {/* Action Skills Group */}
      <div className="flex items-center gap-2">
        {/* Hint Skill */}
        <button
          type="button"
          onClick={onUseHint}
          disabled={hintsLeft <= 0}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
            hintsLeft > 0
              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer shadow-xs'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/40 opacity-50 cursor-not-allowed'
          }`}
          title="提示一组可行解"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>提示 ({hintsLeft})</span>
        </button>

        {/* Bomb Emergency Skill */}
        <button
          type="button"
          onClick={onUseBomb}
          disabled={!canUseBomb}
          className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all overflow-hidden ${
            canUseBomb
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40 cursor-pointer shadow-xs ring-1 ring-rose-500/50'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
          }`}
          title={canUseBomb ? '消除最上方一行化解危险' : `消除求和充能: ${bombCharge}%`}
        >
          {/* Charge background bar */}
          {!canUseBomb && (
            <div
              className="absolute left-0 bottom-0 top-0 bg-rose-500/10 transition-all duration-300"
              style={{ width: `${bombCharge}%` }}
            />
          )}
          <Bomb className={`w-3.5 h-3.5 relative z-10 ${canUseBomb ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
          <span className="relative z-10">
            {canUseBomb ? '炸弹就绪!' : `炸弹 ${bombCharge}%`}
          </span>
        </button>

        {/* Push Row Manually */}
        <button
          type="button"
          onClick={onManualPushRow}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer transition-all shadow-sm"
          title="立即从底部推入新的一行"
        >
          <ArrowUpFromLine className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden xs:inline">推升一行</span>
          <span className="xs:hidden">升行</span>
        </button>
      </div>
    </div>
  );
};
