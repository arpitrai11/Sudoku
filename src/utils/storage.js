// Local Storage management for stats and settings

const STORAGE_KEYS = {
  STATS: 'sudoku_master_stats',
  SETTINGS: 'sudoku_master_settings',
  SAVED_GAME: 'sudoku_master_saved_game',
};

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestTimes: {
    easy: null,
    medium: null,
    hard: null,
    expert: null,
    master: null,
  },
};

const DEFAULT_SETTINGS = {
  theme: 'cyberpunk', // cyberpunk, aurora, sunset, minimal, matcha
  sound: true,
  mistakeLimit: false, // 3 strikes mode vs relaxed
  highlightDuplicates: true,
  highlightSameNumbers: true,
  highlightArea: true,
  autoRemoveNotes: true,
  timerVisible: true,
};

export function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_STATS };
  }
}

export function saveGameWon(difficulty, timeSeconds) {
  const stats = loadStats();
  stats.gamesPlayed += 1;
  stats.gamesWon += 1;
  stats.currentStreak += 1;
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak;
  }

  if (
    !stats.bestTimes[difficulty] ||
    timeSeconds < stats.bestTimes[difficulty]
  ) {
    stats.bestTimes[difficulty] = timeSeconds;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {}
  return stats;
}

export function saveGameLost() {
  const stats = loadStats();
  stats.gamesPlayed += 1;
  stats.currentStreak = 0;
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (e) {}
  return stats;
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {}
}

export function formatTime(totalSeconds) {
  if (totalSeconds === null || totalSeconds === undefined) return '--:--';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
