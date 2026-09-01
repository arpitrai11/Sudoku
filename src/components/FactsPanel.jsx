import React, { useState, useEffect } from 'react';
import { BookOpen, BrainCircuit, X, ChevronRight, ChevronLeft } from 'lucide-react';

const FACTS = [
  {
    title: "Cognitive Boost",
    description: "Playing Sudoku helps improve your memory and logic. It stimulates your mind and can help delay brain aging.",
    icon: <BrainCircuit className="w-8 h-8 text-indigo-400" />
  },
  {
    title: "History of Sudoku",
    description: "The modern game was invented in 1979 by Howard Garns, a 74-year-old freelance puzzle constructor from Indiana, originally named 'Number Place'.",
    icon: <BookOpen className="w-8 h-8 text-emerald-400" />
  },
  {
    title: "What does it mean?",
    description: "Sudoku is a Japanese abbreviation of a longer phrase meaning 'the digits must be single' or 'single number'.",
    icon: <BookOpen className="w-8 h-8 text-rose-400" />
  },
  {
    title: "Endless Possibilities",
    description: "There are 6,670,903,752,021,072,936,960 possible valid Sudoku grids! You will never run out of puzzles.",
    icon: <BrainCircuit className="w-8 h-8 text-amber-400" />
  },
  {
    title: "Focus and Concentration",
    description: "Sudoku requires intense focus. Regular play trains your brain to filter out distractions and improve attention span.",
    icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />
  }
];

export default function FactsPanel({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate facts every 10 seconds
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FACTS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % FACTS.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? FACTS.length - 1 : prev - 1));

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-80 glass-panel z-50 border-l border-[var(--border-color)] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h2 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--accent-color)]" />
            Did you know?
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center relative overflow-hidden">
          
          <div key={currentIndex} className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-card)] flex items-center justify-center mb-6 shadow-inner border border-[var(--border-color)]">
              {FACTS[currentIndex].icon}
            </div>
            <h3 className="text-xl font-bold text-[var(--accent-color)] mb-3">
              {FACTS[currentIndex].title}
            </h3>
            <p className="text-sm text-[var(--text-main)] leading-relaxed opacity-90">
              {FACTS[currentIndex].description}
            </p>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1.5">
            {FACTS.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[var(--accent-color)] w-4' : 'bg-[var(--text-muted)] opacity-50'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="p-2 rounded-xl glass-card hover:bg-[var(--accent-glow)] text-[var(--text-main)] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </>
  );
}
