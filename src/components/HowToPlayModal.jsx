import React from 'react';
import { X, BookOpen, CheckCircle, Zap, Keyboard } from 'lucide-react';

export default function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel p-6 rounded-3xl shadow-2xl border border-[var(--border-color)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">How to Play & Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--accent-glow)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules */}
        <div className="space-y-4 my-5 text-sm text-[var(--text-muted)]">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--text-main)]">Rows & Columns:</strong> Each horizontal row and vertical column must contain numbers 1 through 9 with no duplicates.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--text-main)]">3x3 Subgrids:</strong> Each of the nine 3x3 boxes must also contain numbers 1 through 9 with no duplicates.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--text-main)]">Pencil Notes:</strong> Toggle "Notes" mode to scribble candidate possibilities in empty cells, or hit "Auto-fill valid pencil notes".
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <Keyboard className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Keyboard Shortcuts</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="glass-card p-2 rounded-xl flex justify-between items-center">
              <span>Select Cell</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono">Arrow Keys / Click</kbd>
            </div>
            <div className="glass-card p-2 rounded-xl flex justify-between items-center">
              <span>Input Number</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono">1 - 9</kbd>
            </div>
            <div className="glass-card p-2 rounded-xl flex justify-between items-center">
              <span>Erase Cell</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono">Backspace / Del</kbd>
            </div>
            <div className="glass-card p-2 rounded-xl flex justify-between items-center">
              <span>Toggle Notes</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono">N</kbd>
            </div>
            <div className="glass-card p-2 rounded-xl flex justify-between items-center">
              <span>Undo / Redo</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono">Ctrl+Z / Ctrl+Y</kbd>
            </div>
            <div className="glass-card p-2 rounded-xl flex justify-between items-center">
              <span>Smart Hint</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-color)] font-mono">H</kbd>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold transition-all cursor-pointer"
        >
          Got it, Let's Play!
        </button>
      </div>
    </div>
  );
}
