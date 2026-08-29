import React from 'react';
import { X, Trophy, Flame, Award, Zap, Clock } from 'lucide-react';
import { formatTime } from '../utils/storage';
import { DIFFICULTIES } from '../utils/sudokuGenerator';

export default function StatsModal({ isOpen, onClose, stats }) {
  if (!isOpen) return null;

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl shadow-2xl border border-[var(--border-color)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">Your Statistics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--accent-glow)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-level summary badges */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <div className="glass-card p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)]">Win Rate</div>
              <div className="text-lg font-black text-[var(--text-main)]">{winRate}%</div>
            </div>
          </div>

          <div className="glass-card p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[var(--text-muted)]">Streak</div>
              <div className="text-lg font-black text-[var(--text-main)]">
                {stats.currentStreak} <span className="text-xs font-normal text-[var(--text-muted)]">(Best: {stats.bestStreak})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed stats table */}
        <div className="space-y-2 mb-6">
          <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
            Best Times per Difficulty
          </div>
          <div className="space-y-1.5">
            {Object.entries(DIFFICULTIES).map(([key, diff]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2.5 rounded-xl glass-card text-sm"
              >
                <span className="font-semibold text-[var(--text-main)]">{diff.label}</span>
                <span className="font-mono font-bold text-[var(--accent-color)] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(stats.bestTimes?.[key])}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-[var(--text-muted)]">
          Total Games Played: <strong className="text-[var(--text-main)]">{stats.gamesPlayed}</strong> • Completed: <strong className="text-[var(--text-main)]">{stats.gamesWon}</strong>
        </div>
      </div>
    </div>
  );
}
