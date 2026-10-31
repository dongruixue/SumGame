import React from 'react';
import { X, Target, Zap, Clock, Sparkles, Lightbulb, Bomb } from 'lucide-react';

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
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-lg">
              🐰
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">玩法规则与技巧</h3>
              <p className="text-xs text-slate-400">SumDrop 贪吃兔与胡萝卜求和消除</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="关闭说明"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Rules */}
        <div className="mt-4 space-y-3.5 text-xs text-slate-300">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 shrink-0 text-base">
              🥕
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 text-sm mb-1">
                1. 目标求和消除
              </h4>
              <p className="text-slate-400 leading-relaxed">
                屏幕上方会显示一个<strong className="text-amber-400">目标数字</strong>（例如 14）。点击盘面中的<strong className="text-orange-400">胡萝卜</strong>，当选中胡萝卜身上的数字相加恰好等于目标时，立即消除并收集！
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
                2. 胡萝卜无需相邻
              </h4>
              <p className="text-slate-400 leading-relaxed">
                无需紧挨着，你可以<strong className="text-sky-300">自由挑选盘面上任意位置</strong>的胡萝卜进行相加。选错了随时点击已选胡萝卜撤销。
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-rose-500/30">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0 text-base">
              🐰
            </div>
            <div>
              <h4 className="font-semibold text-rose-300 text-sm mb-1">
                3. 防止胡萝卜碰进兔嘴！
              </h4>
              <p className="text-slate-400 leading-relaxed">
                盘面顶部有一排<strong className="text-rose-400">张着大嘴巴等待的小兔子</strong>！如果胡萝卜堆积推升到小兔子的嘴里（最顶层 Row 0），胡萝卜就会被小兔子一口吃掉，游戏结束！
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
                每次成功凑出目标消除后，底部会向上新增一行胡萝卜。考验持久防守与控盘！
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>计时模式 (Time)</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                必须在 10 秒倒计时结束前完成求和。超时不得分，且会被强制推升一行胡萝卜！
              </p>
            </div>
          </div>

          {/* Special skills */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-2">应急救援道具</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>提示：高亮一组可解胡萝卜</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Bomb className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>炸弹：消除最上行化解兔嘴危机</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            我明白了，保卫胡萝卜！
          </button>
        </div>
      </div>
    </div>
  );
};
