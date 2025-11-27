
import { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameBoard } from './components/GameBoard';
import { motion, AnimatePresence } from 'framer-motion';
import { TrophyIcon, RetryIcon, NextIcon, TrashIcon } from './components/Icons';

function App() {
  const {
    grid,
    score,
    moves,
    selectedTile,
    handleTileClick,
    currentLevel,
    showLevelComplete,
    nextLevel,
    restartLevel,
    combo,
    feedbackMessage,
    resetProgress,
  } = useGameLogic();

  const progress = Math.min((score / currentLevel.targetScore) * 100, 100);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[550px]">
        {/* Header */}
        <motion.div
          className="mb-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 drop-shadow-lg">
            BRAINROT CRUSH
          </h1>
        </motion.div>

        {/* Level and Stats */}
        <div className="flex flex-col gap-3 mb-4 px-2">
          {/* Level indicator */}
          <motion.div
            className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md rounded-xl p-3 border border-purple-400/30"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-purple-200">LEVEL {currentLevel.number}</span>
              <span className="text-sm font-bold text-pink-200">{score} / {currentLevel.targetScore}</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden border border-purple-400/30">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}% ` }}
                transition={{ type: 'spring', stiffness: 100 }}
              />
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="flex gap-3">
            <motion.div
              className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs text-purple-300 uppercase font-bold tracking-wider">Score</span>
              <span className="text-2xl font-black text-white">{score}</span>
            </motion.div>

            <motion.div
              className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col items-center"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xs text-purple-300 uppercase font-bold tracking-wider">Moves</span>
              <span className="text-2xl font-black text-white">{moves}</span>
            </motion.div>

            {combo > 0 && (
              <motion.div
                className="flex-1 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-3 border-2 border-yellow-400/50 flex flex-col items-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <span className="text-xs text-yellow-300 uppercase font-bold tracking-wider">Combo</span>
                <span className="text-2xl font-black text-yellow-400">x{combo}</span>
              </motion.div>
            )}

            <button
              onClick={handleResetClick}
              className="bg-red-500/20 hover:bg-red-500/40 text-red-200 p-3 rounded-xl border border-red-500/30 transition-colors"
              title="Reset Progress"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <GameBoard
            grid={grid}
            selectedTile={selectedTile}
            onTileClick={handleTileClick}
          />

          {/* Feedback Message Overlay - Centered on board */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="text-3xl md:text-4xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(255,215,0,1)] px-4 text-center max-w-full">
                  {feedbackMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <motion.div
          className="mt-4 text-center text-purple-200/60 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="hidden md:block">Click adjacent tiles to swap • Match 3+ to score</p>
          <p className="md:hidden">Swipe to match tiles • Match 3+ to score</p>
        </motion.div>
      </div>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {showLevelComplete && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 max-w-sm md:max-w-md w-full border-4 border-yellow-400 shadow-2xl mx-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >


              <div className="flex justify-center mb-4">
                <TrophyIcon className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
                LEVEL COMPLETE!
              </h2>
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-yellow-300 mb-2">Score: {score}</p>
                <p className="text-lg text-white/80">Target: {currentLevel.targetScore}</p>
              </div>
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={restartLevel}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <RetryIcon className="w-6 h-6" /> Retry
                </button>
                <button
                  onClick={nextLevel}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-black py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
                >
                  Next Level <NextIcon className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {moves === 0 && !showLevelComplete && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-8 max-w-md w-full border-4 border-red-500 shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <h2 className="text-4xl font-black text-white text-center mb-4">
                😢 NO MORE MOVES!
              </h2>
              <div className="text-center mb-6">
                <p className="text-2xl font-bold text-red-400 mb-2">Score: {score}</p>
                <p className="text-lg text-white/80">Target: {currentLevel.targetScore}</p>
              </div>
              <button
                onClick={restartLevel}
                className="w-full bg-red-500 hover:bg-red-400 text-white font-black py-3 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <RetryIcon className="w-6 h-6" /> Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-red-900 to-slate-900 rounded-2xl p-8 max-w-md w-full border-4 border-red-500 shadow-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <h2 className="text-2xl font-black text-white text-center mb-4">
                ⚠️ RESET PROGRESS?
              </h2>
              <p className="text-white/80 text-center mb-6">
                Are you sure you want to delete your save data? You will start over from Level 1.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
