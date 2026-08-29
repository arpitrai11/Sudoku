import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import SudokuGrid from './components/SudokuGrid';
import Numpad from './components/Numpad';
import GameControls from './components/GameControls';
import StatsModal from './components/StatsModal';
import VictoryModal from './components/VictoryModal';
import HowToPlayModal from './components/HowToPlayModal';
import CustomSolverModal from './components/CustomSolverModal';

import {
  generatePuzzle,
  getAutoCandidates,
  getSmartHint,
  isValid,
  DIFFICULTIES,
} from './utils/sudokuGenerator';
import { sounds } from './utils/soundEffects';
import {
  loadStats,
  saveGameWon,
  saveGameLost,
  loadSettings,
  saveSettings,
} from './utils/storage';

export default function App() {
  // Settings & Theme
  const [settings, setSettings] = useState(loadSettings);
  const [soundEnabled, setSoundEnabled] = useState(settings.sound);

  // Puzzle State
  const [difficulty, setDifficulty] = useState('medium');
  const [puzzleData, setPuzzleData] = useState(() => generatePuzzle('medium'));
  const [board, setBoard] = useState(puzzleData.current);
  const [initialBoard, setInitialBoard] = useState(puzzleData.initial);
  const [solution, setSolution] = useState(puzzleData.solution);
  const [notes, setNotes] = useState(puzzleData.notes);

  // Gameplay State
  const [selectedCell, setSelectedCell] = useState([0, 0]);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hintCell, setHintCell] = useState(null);
  const [hintMessage, setHintMessage] = useState('');

  // History for Undo/Redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Stats & Modals
  const [stats, setStats] = useState(loadStats);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSolverOpen, setIsSolverOpen] = useState(false);

  // Combo & Visual Feedback State
  const [ripples, setRipples] = useState([]);
  const [comboCount, setComboCount] = useState(0);
  const [lastCorrectTime, setLastCorrectTime] = useState(0);
  const [comboPopups, setComboPopups] = useState([]);

  // Calculate Progress
  const totalEmptyCells = initialBoard.flat().filter(v => v === 0).length;
  const currentFilledCorrectly = board.flat().filter((val, i) => {
    const r = Math.floor(i / 9);
    const c = i % 9;
    return val !== 0 && initialBoard[r][c] === 0 && val === solution[r][c];
  }).length;
  const completionPercentage = totalEmptyCells === 0 ? 100 : Math.round((currentFilledCorrectly / totalEmptyCells) * 100);

  // Sync theme to body element
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (!isPaused && !isWon && !isGameOver) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, isWon, isGameOver]);

  // Handle Theme Selection
  const handleSelectTheme = (themeId) => {
    const updated = { ...settings, theme: themeId };
    setSettings(updated);
    saveSettings(updated);
    sounds.playPop();
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    sounds.toggleSound(newState);
    const updated = { ...settings, sound: newState };
    setSettings(updated);
    saveSettings(updated);
  };

  // Initialize a new game
  const handleNewGame = useCallback((diff = difficulty) => {
    sounds.playPop();
    const newPuz = generatePuzzle(diff);
    setDifficulty(diff);
    setPuzzleData(newPuz);
    setBoard(newPuz.current);
    setInitialBoard(newPuz.initial);
    setSolution(newPuz.solution);
    setNotes(newPuz.notes);
    setSelectedCell([0, 0]);
    setMistakes(0);
    setTimer(0);
    setIsPaused(false);
    setIsWon(false);
    setIsGameOver(false);
    setHintCell(null);
    setHintMessage('');
    setHistory([]);
    setRedoStack([]);
    setRipples([]);
    setComboCount(0);
    setComboPopups([]);
  }, [difficulty]);

  // Check Victory Condition
  const checkVictory = useCallback(
    (currentBoard) => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentBoard[r][c] === 0 || currentBoard[r][c] !== solution[r][c]) {
            return false;
          }
        }
      }
      return true;
    },
    [solution]
  );

  // Record history snapshot before modification
  const pushHistory = () => {
    const notesCopy = notes.map((row) =>
      row.map((cellSet) => new Set(cellSet))
    );
    setHistory((prev) => [
      ...prev,
      {
        board: board.map((row) => [...row]),
        notes: notesCopy,
        mistakes,
      },
    ]);
    setRedoStack([]);
  };

  // Input a number into current cell
  const handleNumberInput = useCallback(
    (num) => {
      if (isPaused || isWon || isGameOver || !selectedCell) return;
      const [r, c] = selectedCell;

      // Don't allow overwriting initial clues
      if (initialBoard[r][c] !== 0) return;

      pushHistory();

      if (isNotesMode) {
        // Pencil notes mode
        sounds.playNote();
        setNotes((prevNotes) => {
          const newNotes = prevNotes.map((row) =>
            row.map((cellSet) => new Set(cellSet))
          );
          if (newNotes[r][c].has(num)) {
            newNotes[r][c].delete(num);
          } else {
            newNotes[r][c].add(num);
          }
          return newNotes;
        });
      } else {
        // Value mode
        const isCorrect = solution[r][c] === num;
        if (!isCorrect) {
          sounds.playError();
          const newMistakes = mistakes + 1;
          setMistakes(newMistakes);
          setComboCount(0); // Reset combo on mistake

          if (settings.mistakeLimit && newMistakes >= 3) {
            setIsGameOver(true);
            const newStats = saveGameLost();
            setStats(newStats);
          }
        } else {
          sounds.playPlace(num);
          
          // Ripple Effect Trigger
          const ripId = Date.now();
          setRipples(prev => [...prev, { id: ripId, r, c }]);
          setTimeout(() => {
            setRipples(prev => prev.filter(rip => rip.id !== ripId));
          }, 600);

          // Combo Logic
          const now = Date.now();
          if (now - lastCorrectTime < 4000) {
            const newCombo = comboCount + 1;
            setComboCount(newCombo);
            if (newCombo >= 2) {
              const popupId = Date.now();
              setComboPopups(prev => [...prev, { id: popupId, text: `Combo x${newCombo}! 🔥` }]);
              setTimeout(() => {
                setComboPopups(prev => prev.filter(p => p.id !== popupId));
              }, 1200);
            }
          } else {
            setComboCount(1);
          }
          setLastCorrectTime(now);
        }

        const newBoard = board.map((row) => [...row]);
        newBoard[r][c] = num;
        setBoard(newBoard);

        // Auto-remove notes in row, column, and 3x3 box
        if (settings.autoRemoveNotes && isCorrect) {
          setNotes((prevNotes) => {
            const nextNotes = prevNotes.map((row) =>
              row.map((cellSet) => new Set(cellSet))
            );
            // Clear current cell notes
            nextNotes[r][c].clear();

            // Clear row & col
            for (let i = 0; i < 9; i++) {
              nextNotes[r][i].delete(num);
              nextNotes[i][c].delete(num);
            }
            // Clear box
            const startR = Math.floor(r / 3) * 3;
            const startC = Math.floor(c / 3) * 3;
            for (let i = 0; i < 3; i++) {
              for (let j = 0; j < 3; j++) {
                nextNotes[startR + i][startC + j].delete(num);
              }
            }
            return nextNotes;
          });
        }

        // Check if won
        if (checkVictory(newBoard)) {
          setIsWon(true);
          sounds.playWin();
          const updatedStats = saveGameWon(difficulty, timer);
          setStats(updatedStats);
        }
      }
    },
    [
      isPaused,
      isWon,
      isGameOver,
      selectedCell,
      initialBoard,
      isNotesMode,
      board,
      notes,
      solution,
      mistakes,
      settings,
      difficulty,
      timer,
      checkVictory,
      comboCount,
      lastCorrectTime
    ]
  );

  // Erase current cell
  const handleErase = useCallback(() => {
    if (isPaused || isWon || isGameOver || !selectedCell) return;
    const [r, c] = selectedCell;
    if (initialBoard[r][c] !== 0) return;

    if (board[r][c] !== 0 || notes[r][c].size > 0) {
      pushHistory();
      sounds.playErase();

      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = 0;
      setBoard(newBoard);

      setNotes((prevNotes) => {
        const nextNotes = prevNotes.map((row) =>
          row.map((cellSet) => new Set(cellSet))
        );
        nextNotes[r][c].clear();
        return nextNotes;
      });
    }
  }, [isPaused, isWon, isGameOver, selectedCell, initialBoard, board, notes]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isPaused || isWon || isGameOver) return;
    sounds.playPop();

    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    // Push current to redo
    const notesCopy = notes.map((row) =>
      row.map((cellSet) => new Set(cellSet))
    );
    setRedoStack((prev) => [
      ...prev,
      {
        board: board.map((row) => [...row]),
        notes: notesCopy,
        mistakes,
      },
    ]);

    setBoard(previous.board);
    setNotes(previous.notes);
    setMistakes(previous.mistakes);
  }, [history, isPaused, isWon, isGameOver, board, notes, mistakes]);

  // Redo action
  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || isPaused || isWon || isGameOver) return;
    sounds.playPop();

    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));

    const notesCopy = notes.map((row) =>
      row.map((cellSet) => new Set(cellSet))
    );
    setHistory((prev) => [
      ...prev,
      {
        board: board.map((row) => [...row]),
        notes: notesCopy,
        mistakes,
      },
    ]);

    setBoard(nextState.board);
    setNotes(nextState.notes);
    setMistakes(nextState.mistakes);
  }, [redoStack, isPaused, isWon, isGameOver, board, notes, mistakes]);

  // Smart Hint
  const handleHint = useCallback(() => {
    if (isPaused || isWon || isGameOver) return;
    const hint = getSmartHint(board, solution);
    if (hint) {
      sounds.playPop();
      setSelectedCell([hint.row, hint.col]);
      setHintCell({ row: hint.row, col: hint.col });
      setHintMessage(hint.reason);

      // Auto-clear hint message after 6 seconds
      setTimeout(() => {
        setHintMessage('');
      }, 6000);
    }
  }, [isPaused, isWon, isGameOver, board, solution]);

  // Auto-fill valid candidate notes
  const handleAutoCandidateNotes = useCallback(() => {
    sounds.playPop();
    const candidates = getAutoCandidates(board);
    setNotes(candidates);
  }, [board]);

  // Custom Board loader from Solver Modal
  const handleLoadCustomBoard = (customBoard, customSolution) => {
    setDifficulty('custom');
    setBoard(customBoard);
    setInitialBoard(customBoard.map((row) => [...row]));
    setSolution(customSolution);
    setNotes(
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Set())
      )
    );
    setSelectedCell([0, 0]);
    setMistakes(0);
    setTimer(0);
    setIsPaused(false);
    setIsWon(false);
    setIsGameOver(false);
    setHistory([]);
    setRedoStack([]);
  };

  // Keyboard navigation & inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isStatsOpen || isHelpOpen || isSolverOpen) return;

      const [r, c] = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'n' || e.key === 'N') {
        setIsNotesMode((prev) => !prev);
        sounds.playPop();
      } else if (e.key === 'h' || e.key === 'H') {
        handleHint();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        handleRedo();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setSelectedCell([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setSelectedCell([Math.min(8, r + 1), c]);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setSelectedCell([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setSelectedCell([r, Math.min(8, c + 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedCell,
    handleNumberInput,
    handleErase,
    handleUndo,
    handleRedo,
    handleHint,
    isStatsOpen,
    isHelpOpen,
    isSolverOpen,
  ]);

  // Compute number frequency counts for badges (1-9)
  const numberCounts = {};
  for (let num = 1; num <= 9; num++) {
    numberCounts[num] = 0;
  }
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val >= 1 && val <= 9) {
        numberCounts[val] = (numberCounts[val] || 0) + 1;
      }
    }
  }

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="h-screen flex flex-col justify-between overflow-hidden">
      {/* Top Navigation */}
      <Navbar
        currentTheme={settings.theme}
        onSelectTheme={handleSelectTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenSolver={() => setIsSolverOpen(true)}
        onNewGame={() => handleNewGame(difficulty)}
      />

      {/* Main Game Arena */}
      <main className="flex-1 max-w-xl w-full mx-auto px-2 py-1 flex flex-col items-center justify-center gap-1.5 min-h-0">
        
        {/* Greeting Message */}
        <div className="w-full max-w-[440px] text-center mb-1">
          <h2 className="text-sm font-semibold text-[var(--text-main)] opacity-90 animate-in fade-in zoom-in duration-500">
            {getGreeting()}, ready for a puzzle? 🧩
          </h2>
        </div>

        {/* Controls Status Bar */}
        <GameControls
          difficulty={difficulty}
          onChangeDifficulty={(d) => handleNewGame(d)}
          timer={timer}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          onRestart={() => handleNewGame(difficulty)}
          mistakes={mistakes}
          mistakeLimit={settings.mistakeLimit}
          onToggleMistakeLimit={() => {
            const updated = { ...settings, mistakeLimit: !settings.mistakeLimit };
            setSettings(updated);
            saveSettings(updated);
          }}
          completionPercentage={completionPercentage}
        />

        {/* Hint Notification Banner */}
        {hintMessage && (
          <div className="w-full max-w-[440px] glass-panel px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-300 border border-amber-500/40 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <span>Hint: {hintMessage}</span>
            <button
               onClick={() => setHintMessage('')}
              className="text-amber-400 hover:text-white ml-2 cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Floating Combo Popups */}
        <div className="relative w-full max-w-[440px] mx-auto pointer-events-none z-50 flex items-center justify-center">
          {comboPopups.map((popup) => (
            <div key={popup.id} className="combo-popup" style={{ top: '50px' }}>
              {popup.text}
            </div>
          ))}
        </div>

        {/* Sudoku 9x9 Board */}
        <SudokuGrid
          board={board}
          initialBoard={initialBoard}
          notes={notes}
          selectedCell={selectedCell}
          onSelectCell={(r, c) => {
            setSelectedCell([r, c]);
            sounds.playPop();
          }}
          settings={settings}
          hintCell={hintCell}
          isPaused={isPaused}
          onResume={() => setIsPaused(false)}
          ripples={ripples}
        />

        {/* Interactive Numpad & Actions */}
        <Numpad
          onNumberInput={handleNumberInput}
          onErase={handleErase}
          onToggleNotes={() => {
            setIsNotesMode(!isNotesMode);
            sounds.playPop();
          }}
          isNotesMode={isNotesMode}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={history.length > 0}
          canRedo={redoStack.length > 0}
          onHint={handleHint}
          onAutoCandidateNotes={handleAutoCandidateNotes}
          numberCounts={numberCounts}
        />
      </main>

      {/* Footer info */}
      <footer className="py-1 text-center text-[10px] text-[var(--text-muted)] border-t border-[var(--border-color)]">
        Sudoku Pro &bull; React &amp; Tailwind
      </footer>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <CustomSolverModal
        isOpen={isSolverOpen}
        onClose={() => setIsSolverOpen(false)}
        onLoadCustomBoard={handleLoadCustomBoard}
      />

      <VictoryModal
        isOpen={isWon}
        difficulty={difficulty}
        time={timer}
        mistakes={mistakes}
        onPlayAgain={() => handleNewGame(difficulty)}
        onNewGame={() => handleNewGame(difficulty)}
      />

      {/* Game Over (3 strikes) modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm glass-panel p-6 rounded-3xl text-center border border-rose-500/50 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-black mb-2">
              💀
            </div>
            <h2 className="text-xl font-black text-white mb-1">Game Over</h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              You reached 3 mistakes in Strict Mode.
            </p>
            <button
              onClick={() => handleNewGame(difficulty)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
