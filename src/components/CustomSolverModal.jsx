import React, { useState } from 'react';
import { X, Wand2, Play, CheckCircle, RotateCcw, Trash2 } from 'lucide-react';
import { solveSudoku, isValid } from '../utils/sudokuGenerator';

export default function CustomSolverModal({ isOpen, onClose, onLoadCustomBoard }) {
  const [board, setBoard] = useState(
    Array.from({ length: 9 }, () => Array(9).fill(0))
  );
  const [selectedCell, setSelectedCell] = useState([0, 0]);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleCellClick = (r, c) => {
    setSelectedCell([r, c]);
  };

  const handleSetNumber = (num) => {
    const [r, c] = selectedCell;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = num;
    setBoard(newBoard);
    setStatusMsg('');

    // Advance to next cell automatically for quick input
    if (c < 8) {
      setSelectedCell([r, c + 1]);
    } else if (r < 8) {
      setSelectedCell([r + 1, 0]);
    }
  };

  const handleClear = () => {
    setBoard(Array.from({ length: 9 }, () => Array(9).fill(0)));
    setStatusMsg('');
  };

  const handleSolve = () => {
    // Validate if current board has conflicts
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val !== 0) {
          if (!isValid(board, r, c, val)) {
            setStatusMsg('❌ Invalid board: contains conflicting duplicate numbers.');
            return;
          }
        }
      }
    }

    const copy = board.map(row => [...row]);
    const solved = solveSudoku(copy);
    if (solved) {
      setBoard(copy);
      setStatusMsg('✅ Puzzle solved successfully!');
    } else {
      setStatusMsg('❌ No valid solution exists for this configuration.');
    }
  };

  const handlePlayThisPuzzle = () => {
    // Check if valid
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = board[r][c];
        if (val !== 0 && !isValid(board, r, c, val)) {
          setStatusMsg('❌ Fix conflicting numbers before playing.');
          return;
        }
      }
    }

    const copy = board.map(row => [...row]);
    const solution = board.map(row => [...row]);
    if (!solveSudoku(solution)) {
      setStatusMsg('❌ This puzzle has no solution.');
      return;
    }

    onLoadCustomBoard(copy, solution);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel p-6 rounded-3xl shadow-2xl border border-[var(--border-color)] max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-main)]">Custom Sudoku Solver</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Input any puzzle from newspaper or web to solve or play
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--accent-glow)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board */}
        <div className="my-4 flex justify-center">
          <div className="sudoku-board max-w-[340px] aspect-square">
            {board.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedCell[0] === r && selectedCell[1] === c;
                const isBorderRightThick = (c + 1) % 3 === 0 && c !== 8;
                const isBorderBottomThick = (r + 1) % 3 === 0 && r !== 8;

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`sudoku-cell text-base font-bold
                      ${isBorderRightThick ? 'border-right-thick' : ''}
                      ${isBorderBottomThick ? 'border-bottom-thick' : ''}
                      ${isSelected ? 'selected' : ''}
                    `}
                  >
                    {val !== 0 ? val : ''}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Numpad for input */}
        <div className="grid grid-cols-10 gap-1 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleSetNumber(n)}
              className="py-2.5 rounded-xl glass-card font-bold hover:bg-[var(--accent-color)] hover:text-white text-sm transition-all cursor-pointer"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleSetNumber(0)}
            className="py-2.5 rounded-xl glass-card font-semibold hover:bg-rose-500/20 text-rose-400 text-xs transition-all flex items-center justify-center cursor-pointer"
            title="Clear Cell"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMsg && (
          <div className="p-2.5 rounded-xl mb-4 text-xs font-semibold text-center glass-card border border-[var(--border-color)]">
            {statusMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="p-2.5 rounded-xl glass-card hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={handleSolve}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>Solve Puzzle</span>
          </button>
          <button
            onClick={handlePlayThisPuzzle}
            className="flex-1 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>Play This Board</span>
          </button>
        </div>
      </div>
    </div>
  );
}
