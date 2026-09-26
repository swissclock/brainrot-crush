import { useState, type ReactNode } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameBoard } from './components/GameBoard';
import { motion, AnimatePresence } from 'framer-motion';
import { RetryIcon, NextIcon, TrashIcon, StarIcon } from './components/Icons';
import { CHARACTER_IMAGES } from './characterImages';
import { CHARACTER_NAMES, LEVELS } from './types';

// Background sprinkles get their random positions once. Computing them inline gave every
// re-render (several per move) new keyframes, restarting every animation each time.
const SPRINKLE_COLORS = ['bg-scoop-blueberry', 'bg-scoop-strawberry', 'bg-scoop-pistachio', 'bg-scoop-lemon', 'bg-scoop-lavender'];
const SPRINKLES = Array.from({ length: 14 }, (_, i) => ({
  color: SPRINKLE_COLORS[i % SPRINKLE_COLORS.length],
  left: Math.random() * 100,
  top: Math.random() * 100,
  rotate: Math.random() * 180,
  dy: 4 + Math.random() * 6,
  duration: 6 + Math.random() * 6,
}));

// Stars are earned on how many moves are left when the target is reached.
const starsFor = (movesLeft: number, totalMoves: number) => {
  const ratio = movesLeft / totalMoves;
  if (ratio >= 0.3) return 3;
  if (ratio >= 0.1) return 2;
  return 1;
};

const Modal = ({ children }: { children: ReactNode }) => (
  <motion.div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-full max-w-sm bg-gelato-surface rounded-[28px] px-6 pt-7 pb-6 flex flex-col items-center gap-5 shadow-bevel-lg"
      initial={{ scale: 0.6, y: 40 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.6, y: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const Stat = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex-1 bg-gelato-bg rounded-2xl py-2.5 flex flex-col items-center">
    <span className="text-[11px] font-black tracking-[0.15em] text-gelato-muted">{label}</span>
    <span className="font-display text-2xl">{value}</span>
  </div>
);

const primaryButton =
  'w-full min-h-14 rounded-[18px] bg-gelato-strawberry hover:bg-gelato-strawberry-hi text-gelato-strawberry-ink font-display text-xl flex items-center justify-center gap-2 shadow-button transition-colors active:translate-y-px';
const secondaryButton =
  'w-full min-h-12 rounded-2xl bg-gelato-tray hover:bg-gelato-line text-gelato-cream font-black flex items-center justify-center gap-2 transition-colors';

function App() {
  const {
    grid,
    score,
    moves,
    selectedTile,
    handleTileClick,
    handleTileSwipe,
    boardId,
    currentLevel,
    showLevelComplete,
    nextLevel,
    restartLevel,
    combo,
    feedbackMessage,
    resetProgress,
  } = useGameLogic();

  const progress = Math.min((score / currentLevel.targetScore) * 100, 100);
  const stars = starsFor(moves, currentLevel.moves);
  const isLastLevel = currentLevel.number === LEVELS[LEVELS.length - 1].number;
  const mascot = currentLevel.characters[0];

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-gelato-bg bg-[radial-gradient(circle_at_50%_-10%,#3A2620_0%,#1B1311_60%)] flex flex-col items-center justify-center px-4 py-3 overflow-hidden">
      {/* Background sprinkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {SPRINKLES.map((s, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-4 rounded-full opacity-20 ${s.color}`}
            animate={{ y: [0, `${s.dy}vh`] }}
            transition={{ duration: s.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            style={{ left: `${s.left}%`, top: `${s.top}%`, rotate: s.rotate }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[520px] flex flex-col gap-3 md:gap-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="w-9 h-9" />
            <h1 className="font-display text-[26px] md:text-3xl leading-none">
              Brainrot <span className="text-gelato-strawberry">Crush</span>
            </h1>
          </div>
          <button
            onClick={handleResetClick}
            aria-label="Reset progress"
            title="Reset progress"
            className="w-11 h-11 rounded-[14px] bg-gelato-raised hover:bg-gelato-tray text-gelato-soft flex items-center justify-center shadow-bevel transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Level progress */}
        <div className="bg-gelato-surface rounded-[20px] px-4 pt-3.5 pb-4 flex flex-col gap-2.5 shadow-bevel">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-black tracking-[0.12em] text-gelato-lemon">LEVEL {currentLevel.number}</span>
            <span className="text-sm font-extrabold text-gelato-soft">
              <span className="text-gelato-cream">{score}</span> / {currentLevel.targetScore}
            </span>
          </div>
          <div className="h-4 rounded-full bg-gelato-deep overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gelato-strawberry shadow-[inset_0_3px_0_rgba(255,255,255,0.35)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-2.5">
          <div className="flex-1 bg-gelato-surface rounded-[18px] py-2.5 flex flex-col items-center shadow-bevel">
            <span className="text-[11px] font-black tracking-[0.15em] text-gelato-muted">MOVES</span>
            <span className="font-display text-3xl leading-tight">{moves}</span>
          </div>
          <div className="flex-1 bg-gelato-surface rounded-[18px] py-2.5 flex flex-col items-center shadow-bevel">
            <span className="text-[11px] font-black tracking-[0.15em] text-gelato-muted">SCORE</span>
            <span className="font-display text-3xl leading-tight">{score}</span>
          </div>
          <div
            className={`flex-1 rounded-[18px] py-2.5 flex flex-col items-center transition-colors ${combo > 0
              ? 'bg-gelato-lemon text-gelato-lemon-ink shadow-[inset_0_-4px_0_rgba(0,0,0,0.18)]'
              : 'bg-gelato-surface text-gelato-line shadow-bevel'}`}
          >
            <span className={`text-[11px] font-black tracking-[0.15em] ${combo > 0 ? 'text-[#5A3A00]' : 'text-gelato-muted'}`}>COMBO</span>
            <span className="font-display text-3xl leading-tight">×{combo}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="relative">
          <GameBoard
            grid={grid}
            selectedTile={selectedTile}
            onTileClick={handleTileClick}
            onTileSwipe={handleTileSwipe}
            boardId={boardId}
            characters={currentLevel.characters}
          />

          {/* Feedback Message Overlay - Centered on board */}
          <AnimatePresence>
            {feedbackMessage && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                initial={{ scale: 0, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="font-display text-4xl md:text-5xl text-gelato-lemon text-outline px-4 text-center max-w-full">
                  {feedbackMessage}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <p className="text-center text-[13px] font-bold text-gelato-faint">
          <span className="hidden md:inline">Click two neighbours to swap</span>
          <span className="md:hidden">Swipe a character to swap</span>
          {' · '}match 3 or more
        </p>
      </div>

      {/* Level Complete Modal */}
      <AnimatePresence>
        {showLevelComplete && (
          <Modal>
            <div className="flex items-end gap-1.5" role="img" aria-label={`${stars} of 3 stars`}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: i === 0 ? -12 : i === 2 ? 12 : 0 }}
                  transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 300, damping: 14 }}
                >
                  <StarIcon className={`${i === 1 ? 'w-[76px] h-[76px]' : 'w-[54px] h-[54px]'} ${i < stars ? 'text-gelato-lemon' : 'text-gelato-line'}`} />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[13px] font-black tracking-[0.15em] text-gelato-lemon">LEVEL {currentLevel.number} CLEARED</span>
              <h2 className="font-display text-[44px] leading-none text-center">Bellissimo!</h2>
            </div>

            <img src={CHARACTER_IMAGES[mascot]} alt={CHARACTER_NAMES[mascot]} className="w-32 h-32 object-contain" />

            <div className="w-full flex gap-2.5">
              <Stat label="SCORE" value={score} />
              <Stat label="MOVES LEFT" value={moves} />
            </div>

            <div className="w-full flex flex-col gap-2.5">
              {!isLastLevel && (
                <button onClick={nextLevel} className={primaryButton}>
                  Next level <NextIcon className="w-5 h-5" />
                </button>
              )}
              <button onClick={restartLevel} className={secondaryButton}>
                <RetryIcon className="w-5 h-5" /> {stars < 3 ? 'Replay for 3 stars' : 'Replay'}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {moves === 0 && !showLevelComplete && (
          <Modal>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[13px] font-black tracking-[0.15em] text-gelato-strawberry">OUT OF MOVES</span>
              <h2 className="font-display text-4xl leading-none text-center">Mamma mia!</h2>
            </div>

            <img src={CHARACTER_IMAGES[mascot]} alt={CHARACTER_NAMES[mascot]} className="w-28 h-28 object-contain -rotate-12" />

            <div className="w-full flex gap-2.5">
              <Stat label="SCORE" value={score} />
              <Stat label="TARGET" value={currentLevel.targetScore} />
            </div>

            <button onClick={restartLevel} className={primaryButton}>
              <RetryIcon className="w-5 h-5" /> Try again
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <Modal>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="font-display text-3xl leading-tight">Start over?</h2>
              <p className="font-semibold text-gelato-soft">
                This deletes your saved progress and sends you back to level 1.
              </p>
            </div>
            <div className="w-full flex flex-col gap-2.5">
              <button onClick={confirmReset} className={primaryButton}>
                Yes, reset
              </button>
              <button onClick={() => setShowResetConfirm(false)} className={secondaryButton}>
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
