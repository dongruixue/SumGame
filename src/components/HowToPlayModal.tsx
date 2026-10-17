import React from 'react';
import { X, Target, Zap, Clock, ShieldAlert, Sparkles, Lightbulb, Bomb } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              ?
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">游戏规则与玩法技巧</h3>
              <p className="text-xs text-slate-400">SumDrop 数学求和消除指南</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="关闭说明"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Rules */}
        <div className="mt-4 space-y-4 text-xs text-slate-300">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">
                1. 目标求和消除
              </h4>
              <p className="text-slate-400 leading-relaxed">
                屏幕上方会显示一个<strong className="text-amber-400">目标数字</strong>（例如 14）。点击盘面中的数字方块，当选中数字相加恰好等于目标时，方块立即消除！
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">
                2. 数字无需相邻
              </h4>
              <p className="text-slate-400 leading-relaxed">
                与传统三消不同，你可以<strong className="text-sky-300">自由跨越任意行列</strong>，挑选网格中任意方块凑出总和。点击已选中的方块可随时撤回。
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">
                3. 防止触顶淘汰
              </h4>
              <p className="text-slate-400 leading-relaxed">
                顶部设有<strong className="text-rose-400">红线警戒区</strong>。如果方块堆积到达或被推挤到最顶层（Row 0），游戏将立即结束！
              </p>
            </div>
          </div>

          {/* Modes Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>经典模式 (Classic)</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                每次成功消除目标数字，底部会向上新增一行方块。考验持久生存与宏观控盘能力。
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>计时模式 (Time)</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                必须在倒计时（10秒）结束前完成求和。若倒计时耗尽，该轮不得分且会强制新增一行！
              </p>
            </div>
          </div>

          {/* Special skills */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-2">救援道具说明</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>提示：高亮一组可解方案</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Bomb className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>炸弹：消除最上行化解触顶</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            我明白了，开始挑战！
          </button>
        </div>
      </div>
    </div>
  );
};
