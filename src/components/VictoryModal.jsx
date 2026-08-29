import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap, Clock, Play, RotateCcw, Share2 } from 'lucide-react';
import { formatTime } from '../utils/storage';
import { DIFFICULTIES } from '../utils/sudokuGenerator';

export default function VictoryModal({
  isOpen,
  difficulty,
  time,
  mistakes,
  onPlayAgain,
  onNewGame,
}) {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory particle cannons
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const diffLabel = DIFFICULTIES[difficulty]?.label || difficulty;

  const handleShare = () => {
    const text = `🧩 I solved a ${diffLabel} Sudoku puzzle in ${formatTime(time)} with ${mistakes} mistakes! Can you beat my time?`;
    if (navigator.share) {
      navigator.share({ title: 'Sudoku Pro Victory', text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Score copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl border border-[var(--border-color)] text-center">
        {/* Big Trophy Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-2xl shadow-amber-500/40 mb-4 animate-bounce">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-3xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400">
          PUZZLE SOLVED!
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Phenomenal focus! You conquered the grid.
        </p>

        {/* Score Summary Box */}
        <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl glass-card mb-6">
          <div className="flex flex-col items-center">
            <span className="text-xs text-[var(--text-muted)]">Difficulty</span>
            <span className="text-sm font-bold text-[var(--accent-color)] mt-1">{diffLabel}</span>
          </div>
          <div className="flex flex-col items-center border-x border-[var(--border-color)]">
            <span className="text-xs text-[var(--text-muted)]">Time</span>
            <span className="text-sm font-mono font-bold text-[var(--text-main)] mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(time)}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-[var(--text-muted)]">Mistakes</span>
            <span className="text-sm font-bold text-[var(--text-main)] mt-1">{mistakes}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Play Next Puzzle</span>
          </button>

          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
