# Sudoku Pro

A modern, highly interactive, and visually stunning Sudoku web application built with React, Vite, and Tailwind CSS. Sudoku Pro offers a premium puzzle-solving experience with dynamic themes, satisfying micro-animations, and advanced gameplay features.

## ✨ Features

- **Modern UI/UX**: Glassmorphism design with responsive, fluid mechanics.
- **Dynamic Themes**: Choose from 5 beautiful color themes (Cyber Neon, Aurora Glow, Sunset Amber, Midnight Blue, Daylight Clean) that instantly change the look and feel of the app.
- **Kinetic 3D Board Tilt**: The Sudoku board reacts to your mouse movements, providing a subtle 3D floating effect.
- **Satisfying Animations**: Enjoy ripple shockwaves and bouncy number scaling when placing correct numbers.
- **Combo System**: Gamified combo popups for rapid correct placements.
- **Progress Tracking**: A sleek progress bar visualizes your completion percentage in real-time.
- **Smart Hint System**: Stuck? Get intelligent, step-by-step hints explaining the logic behind the next move.
- **Procedural Audio**: Immersive, dynamically generated sound effects (pops, notes, win/error sounds) built using the Web Audio API (no external sound files required).
- **Custom Solver & Scanner**: Input your own Sudoku puzzles from external sources to solve them within the app.
- **Multiple Difficulties**: Ranging from Easy to Expert.
- **Robust Persistence**: LocalStorage integration automatically saves your puzzle state, timer, history, and settings so you can resume exactly where you left off.
- **Mistake Limits**: Optional "Strict Mode" that ends the game after 3 mistakes.

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (using `@tailwindcss/vite`)
- **Icons**: `lucide-react`
- **Animations**: CSS Keyframes & `canvas-confetti` (for victory celebrations)

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or newer recommended) installed.

### Installation

1. **Clone the repository** (if applicable) or download the source code:
   ```bash
   git clone <repository-url>
   cd Sudoku
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to `http://localhost:5173/` (or the port specified in your terminal) to play the game!

## 🎮 How to Play

1. **Goal**: Fill the 9x9 grid so that each row, column, and 3x3 subgrid contains all digits from 1 to 9.
2. **Controls**: 
   - Click a cell to select it.
   - Use the on-screen Numpad or your keyboard (1-9) to input numbers.
   - Use the Arrow keys, W/A/S/D to navigate the board.
   - Press `N` to toggle Pencil/Notes mode.
   - Press `H` for a Smart Hint.
   - Use `Ctrl+Z` (Undo) and `Ctrl+Y` (Redo) to manage your history.
3. **Pencil Notes**: Use Notes mode to jot down possible candidates for a cell. 
4. **Auto-Remove Notes**: When a correct number is placed, conflicting pencil notes in the same row, column, and box are automatically removed.

## 📜 License

This project is open-source and available for personal or educational use.
