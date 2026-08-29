import React from 'react';
import {
  Grid3X3,
  Volume2,
  VolumeX,
  Trophy,
  HelpCircle,
  Palette,
  RotateCcw,
  PenTool,
  BookOpen,
} from 'lucide-react';

const THEMES = [
  { id: 'cyberpunk', name: 'Cyber Neon', dot: '#6366f1' },
  { id: 'aurora', name: 'Aurora Glow', dot: '#14b8a6' },
  { id: 'sunset', name: 'Sunset Amber', dot: '#f97316' },
  { id: 'minimal', name: 'Midnight Blue', dot: '#38bdf8' },
  { id: 'light', name: 'Daylight Clean', dot: '#4f46e5' },
];

export default function Navbar({
  currentTheme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  onOpenStats,
  onOpenHelp,
  onOpenSolver,
  onOpenFacts,
  onNewGame,
}) {
  const [themeDropdownOpen, setThemeDropdownOpen] = React.useState(false);

  return (
    <header className="w-full glass-panel sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b border-[var(--border-color)]">
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Grid3X3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            SUDOKU <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--accent-color)] ml-1 border border-[var(--accent-color)]">PRO</span>
          </h1>
          <p className="text-[11px] text-[var(--text-muted)] tracking-wide hidden sm:block">
            Mind Puzzles • Fluid Mechanics
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Theme Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Choose Theme"
          >
            <Palette className="w-4 h-4 text-[var(--accent-color)]" />
            <span className="hidden md:inline">Theme</span>
          </button>

          {themeDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setThemeDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-44 rounded-2xl glass-panel p-2 shadow-2xl z-50 flex flex-col gap-1 border border-[var(--border-color)] animate-in fade-in zoom-in duration-150">
                <div className="text-[11px] font-bold text-[var(--text-muted)] px-3 py-1 uppercase tracking-wider">
                  Color Themes
                </div>
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                      currentTheme === t.id
                        ? 'bg-[var(--accent-glow)] text-[var(--text-main)] font-bold'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow"
                      style={{ backgroundColor: t.dot }}
                    />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Custom Puzzle Solver / Creator */}
        <button
          onClick={onOpenSolver}
          className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          title="Custom Solver & Scanner"
        >
          <PenTool className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="hidden md:inline">Solver</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-all cursor-pointer"
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[var(--accent-color)]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
          )}
        </button>

        {/* Stats modal button */}
        <button
          onClick={onOpenStats}
          className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-all cursor-pointer"
          title="Statistics & Records"
        >
          <Trophy className="w-4 h-4 text-amber-400" />
        </button>

        {/* Facts button */}
        <button
          onClick={onOpenFacts}
          className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-all cursor-pointer md:hidden"
          title="Sudoku Facts & Benefits"
        >
          <BookOpen className="w-4 h-4 text-indigo-400" />
        </button>

        {/* How to Play button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-all cursor-pointer"
          title="Rules & Guide"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </header>
  );
}
