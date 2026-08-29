// Fast, complete backtracking Sudoku generator, unique solver, and difficulty manager

/**
 * Check if num can be placed in board at row, col
 */
export function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) return false;
    if (board[i][col] === num && i !== row) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curR = startRow + r;
      const curC = startCol + c;
      if (board[curR][curC] === num && (curR !== row || curC !== col)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Solve a Sudoku board in place using backtracking
 */
export function solveSudoku(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Count solutions to ensure uniqueness
 */
export function countSolutions(board, countRef = { count: 0 }) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            countSolutions(board, countRef);
            board[r][c] = 0;
            if (countRef.count >= 2) return;
          }
        }
        return;
      }
    }
  }
  countRef.count++;
}

/**
 * Shuffle array utility
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a complete valid 9x9 Sudoku board
 */
export function generateSolvedBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  function fillCell(r, c) {
    if (r === 9) return true;
    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of numbers) {
      if (isValid(board, r, c, num)) {
        board[r][c] = num;
        if (fillCell(nextR, nextC)) return true;
        board[r][c] = 0;
      }
    }
    return false;
  }

  fillCell(0, 0);
  return board;
}

export const DIFFICULTIES = {
  easy: { name: 'Easy', blanks: 32, label: '🌱 Easy' },
  medium: { name: 'Medium', blanks: 42, label: '⚡ Medium' },
  hard: { name: 'Hard', blanks: 50, label: '🔥 Hard' },
  expert: { name: 'Expert', blanks: 56, label: '💀 Expert' },
  master: { name: 'Master', blanks: 60, label: '👑 Master' },
};

/**
 * Generate a puzzle given a solved board and a difficulty
 */
export function generatePuzzle(difficultyKey = 'medium') {
  const solved = generateSolvedBoard();
  const puzzle = solved.map(row => [...row]);
  const blanks = (DIFFICULTIES[difficultyKey] || DIFFICULTIES.medium).blanks;

  const positions = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }

  const shuffledPositions = shuffle(positions);
  let removed = 0;

  for (const [r, c] of shuffledPositions) {
    if (removed >= blanks) break;

    const temp = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check if still uniquely solvable
    const copy = puzzle.map(row => [...row]);
    const countRef = { count: 0 };
    countSolutions(copy, countRef);

    if (countRef.count !== 1) {
      puzzle[r][c] = temp; // restore
    } else {
      removed++;
    }
  }

  // Create initial notes grid (9x9 set of numbers or empty)
  const initialNotes = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set())
  );

  return {
    initial: puzzle.map(row => [...row]),
    current: puzzle.map(row => [...row]),
    solution: solved,
    notes: initialNotes,
    difficulty: difficultyKey,
  };
}

/**
 * Get all potential candidate notes for every empty cell automatically
 */
export function getAutoCandidates(board) {
  const candidates = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set())
  );

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            candidates[r][c].add(num);
          }
        }
      }
    }
  }

  return candidates;
}

/**
 * Find a smart hint for the user
 */
export function getSmartHint(board, solution) {
  // 1. Look for Naked Singles (cell with only 1 possible candidate)
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const valids = [];
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            valids.push(num);
          }
        }
        if (valids.length === 1) {
          return {
            row: r,
            col: c,
            value: valids[0],
            reason: `Only number ${valids[0]} can fit in Row ${r + 1}, Col ${c + 1} (Naked Single)!`,
          };
        }
      }
    }
  }

  // 2. Fallback: Find any empty cell and return its solution value
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        return {
          row: r,
          col: c,
          value: solution[r][c],
          reason: `Revealed cell at Row ${r + 1}, Col ${c + 1} is ${solution[r][c]}.`,
        };
      }
    }
  }

  return null;
}
