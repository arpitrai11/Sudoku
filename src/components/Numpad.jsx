import React from 'react';
import {
  Undo2,
  Redo2,
  Eraser,
  Edit3,
  Search,
  CheckSquare,
} from 'lucide-react';

export default function Numpad({
  onNumberInput,
  onErase,
  onToggleNotes,
  isNotesMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onHint,
  onAutoCandidateNotes,
  numberCounts,
}) {
  return (
    <div className="w-full max-w-[440px] mx-auto flex flex-col gap-2.5 px-1">
      {/* Utility Action Bar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex flex-col items-center justify-center p-2 rounded-xl glass-card transition-all cursor-pointer ${
            canUndo
              ? 'hover:bg-[var(--accent-glow)] text-[var(--text-main)] hover:scale-105 active:scale-95'
              : 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
          }`}
          title="Undo (Ctrl+Z / U)"
        >
          <Undo2 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-semibold">Undo</span>
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`flex flex-col items-center justify-center p-2 rounded-xl glass-card transition-all cursor-pointer ${
            canRedo
              ? 'hover:bg-[var(--accent-glow)] text-[var(--text-main)] hover:scale-105 active:scale-95'
              : 'opacity-40 cursor-not-allowed text-[var(--text-muted)]'
          }`}
          title="Redo (Ctrl+Y / R)"
        >
          <Redo2 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-semibold">Redo</span>
        </button>

        {/* Erase */}
        <button
          onClick={onErase}
          className="flex flex-col items-center justify-center p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Erase cell (Backspace / Delete)"
        >
          <Eraser className="w-4 h-4 mb-0.5 text-rose-400" />
          <span className="text-[10px] font-semibold">Erase</span>
        </button>

        {/* Notes Toggle */}
        <button
          onClick={onToggleNotes}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer relative ${
            isNotesMode
              ? 'bg-[var(--accent-color)] text-white shadow-lg shadow-indigo-500/30 scale-105 border border-indigo-400'
              : 'glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] hover:scale-105 active:scale-95'
          }`}
          title="Notes / Pencil Mode (Press N)"
        >
          <Edit3 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-semibold">
            {isNotesMode ? 'Notes ON' : 'Notes'}
          </span>
          {isNotesMode && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          )}
        </button>

        {/* Smart Hint */}
        <button
          onClick={onHint}
          className="flex flex-col items-center justify-center p-2 rounded-xl glass-card hover:bg-amber-500/20 text-[var(--text-main)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Get Smart Hint (Press H)"
        >
          <Search className="w-4 h-4 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-semibold">Hint</span>
        </button>
      </div>

      {/* 1-9 Number Buttons */}
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const count = numberCounts[num] || 0;
          const isComplete = count >= 9;

          return (
            <button
              key={num}
              onClick={() => onNumberInput(num)}
              disabled={isComplete}
              className={`relative flex flex-col items-center justify-center py-2 sm:py-2.5 rounded-xl font-bold transition-all text-base sm:text-lg cursor-pointer ${
                isComplete
                  ? 'opacity-25 bg-[var(--cell-bg)] cursor-not-allowed text-[var(--text-muted)]'
                  : 'glass-card hover:bg-[var(--accent-color)] hover:text-white hover:shadow-md hover:scale-105 active:scale-95 text-[var(--text-main)]'
              }`}
            >
              <span>{num}</span>
              <span
                className={`text-[9px] font-medium leading-none ${
                  isComplete ? 'text-emerald-400 font-bold' : 'text-[var(--text-muted)]'
                }`}
              >
                {isComplete ? '✓' : 9 - count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Autofill Notes helper badge */}
      <div className="flex justify-between items-center px-1 text-[11px] text-[var(--text-muted)]">
        <button
          onClick={onAutoCandidateNotes}
          className="flex items-center gap-1 hover:text-[var(--accent-color)] transition-colors cursor-pointer"
        >
          <CheckSquare className="w-3 h-3 text-indigo-400" />
          <span>Auto-fill pencil notes</span>
        </button>
        <span className="hidden sm:inline">Use 1-9 or Arrow keys</span>
      </div>
    </div>
  );
}
