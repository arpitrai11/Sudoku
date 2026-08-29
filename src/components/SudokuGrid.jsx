import React, { useState, useRef, useCallback } from 'react';

export default function SudokuGrid({
  board,
  initialBoard,
  notes,
  selectedCell,
  onSelectCell,
  settings,
  hintCell,
  isPaused,
  onResume,
  ripples = [],
}) {
  const [selectedRow, selectedCol] = selectedCell || [-1, -1];
  const selectedValue =
    selectedRow !== -1 && selectedCol !== -1 ? board[selectedRow][selectedCol] : 0;

  // 3D Tilt State
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || isPaused) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-5 to 5 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setTilt({ x: rotateX, y: rotateY });
  }, [isPaused]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  // Check if a cell has an active conflict (duplicate in row/col/box)
  const isDuplicate = (r, c, val) => {
    if (val === 0 || !settings.highlightDuplicates) return false;

    // Row conflict
    for (let i = 0; i < 9; i++) {
      if (i !== c && board[r][i] === val) return true;
    }
    // Col conflict
    for (let i = 0; i < 9; i++) {
      if (i !== r && board[i][c] === val) return true;
    }
    // Box conflict
    const startR = Math.floor(r / 3) * 3;
    const startC = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const curR = startR + i;
        const curC = startC + j;
        if ((curR !== r || curC !== c) && board[curR][curC] === val) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <div 
      className="relative w-full max-w-[440px] mx-auto p-1 flex items-center justify-center"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {/* Paused Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-30 rounded-2xl glass-panel flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-glow)] flex items-center justify-center mb-3 border border-[var(--accent-color)] animate-pulse">
            <svg
              className="w-7 h-7 text-[var(--accent-color)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
            </svg>
          </div>
          <h3 className="text-xl font-black mb-1 text-[var(--text-main)]">Game Paused</h3>
          <p className="text-xs text-[var(--text-muted)] mb-5 max-w-xs">
            Take a breather. Your puzzle state & timer are safely preserved.
          </p>
          <button
            onClick={onResume}
            className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold tracking-wide shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-105 cursor-pointer"
          >
            Resume Puzzle
          </button>
        </div>
      )}

      {/* 9x9 Board */}
      <div 
        className={`sudoku-board ${isPaused ? 'filter blur-md' : ''}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {board.map((row, r) =>
          row.map((val, c) => {
            const isSelected = selectedRow === r && selectedCol === c;
            const isInitial = initialBoard[r][c] !== 0;
            const isSameNumber =
              settings.highlightSameNumbers &&
              selectedValue !== 0 &&
              val === selectedValue;
            const isRelatedArea =
              settings.highlightArea &&
              (selectedRow === r ||
                selectedCol === c ||
                (Math.floor(selectedRow / 3) === Math.floor(r / 3) &&
                  Math.floor(selectedCol / 3) === Math.floor(c / 3)));

            const isError = isDuplicate(r, c, val);
            const isHint = hintCell && hintCell.row === r && hintCell.col === c;

            // Check if this cell has an active ripple
            const cellRipple = ripples.find(rip => rip.r === r && rip.c === c);

            // Thick subgrid borders
            const isBorderRightThick = (c + 1) % 3 === 0 && c !== 8;
            const isBorderBottomThick = (r + 1) % 3 === 0 && r !== 8;

            const cellNotes = notes[r][c] ? Array.from(notes[r][c]) : [];

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => onSelectCell(r, c)}
                className={`sudoku-cell
                  ${isBorderRightThick ? 'border-right-thick' : ''}
                  ${isBorderBottomThick ? 'border-bottom-thick' : ''}
                  ${isSelected ? 'selected' : ''}
                  ${!isSelected && isSameNumber ? 'same-number' : ''}
                  ${!isSelected && !isSameNumber && isRelatedArea ? 'highlighted' : ''}
                  ${isError ? 'error-val' : ''}
                  ${isHint ? 'hint-val' : ''}
                  ${isInitial ? 'fixed-val' : 'user-val'}
                `}
                aria-label={`Cell Row ${r + 1} Column ${c + 1}`}
              >
                {cellRipple && <div key={cellRipple.id} className="ripple" />}
                {val !== 0 ? (
                  <span className={cellRipple ? 'pop-animation' : ''}>{val}</span>
                ) : (
                  <div className="notes-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <div key={n} className="note-number">
                        {cellNotes.includes(n) ? n : ''}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
