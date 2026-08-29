import React from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { DIFFICULTIES } from '../utils/sudokuGenerator';
import { formatTime } from '../utils/storage';

export default function GameControls({
  difficulty,
  onChangeDifficulty,
  timer,
  isPaused,
  onTogglePause,
  onRestart,
  mistakes,
  mistakeLimit,
  onToggleMistakeLimit,
  completionPercentage = 0,
}) {
  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col gap-1.5 px-1">
      {/* Top status line: Difficulty, Mistakes, Timer */}
      <div className="flex items-center justify-between glass-card px-3.5 py-1.5 rounded-xl">
        {/* Difficulty pill */}
        <div className="flex items-center gap-1">
          <select
            value={difficulty}
            onChange={(e) => onChangeDifficulty(e.target.value)}
            className="bg-transparent text-xs font-bold text-[var(--accent-color)] outline-none cursor-pointer pr-1 hover:opacity-80 transition-opacity"
          >
            {Object.entries(DIFFICULTIES).map(([key, diff]) => (
              <option
                key={key}
                value={key}
                className="bg-[var(--bg-primary)] text-[var(--text-main)]"
              >
                {diff.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mistakes Counter */}
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={onToggleMistakeLimit}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg hover:bg-[var(--accent-glow)] transition-all cursor-pointer"
            title={mistakeLimit ? 'Strict 3-Mistakes Mode ON' : 'Relaxed Mistakes Mode'}
          >
            {mistakeLimit ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className={mistakes > 0 && mistakeLimit ? 'text-rose-400' : 'text-[var(--text-muted)]'}>
              Mistakes: {mistakes}{mistakeLimit ? '/3' : ''}
            </span>
          </button>
        </div>

        {/* Timer & Pause */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold tracking-wider text-[var(--text-main)]">
            {formatTime(timer)}
          </span>
          <button
            onClick={onTogglePause}
            className="p-1 rounded-lg hover:bg-[var(--accent-glow)] text-[var(--accent-color)] transition-all cursor-pointer"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[var(--cell-bg)] rounded-full overflow-hidden border border-[var(--border-color)]">
        <div 
          className="h-full bg-[var(--accent-color)] shadow-[0_0_8px_var(--accent-color)] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );
}
