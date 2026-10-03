import { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GameBoard } from './components/GameBoard';
import { LevelMap } from './components/LevelMap';
import { motion, AnimatePresence } from 'framer-motion';
import { RetryIcon, NextIcon, MapIcon, StarIcon } from './components/Icons';
import { Modal, PrimaryButton, SecondaryButton, Stars, Stat } from './components/ui';
import { CHARACTER_IMAGES } from './characterImages';
import { CHARACTER_NAMES, LEVELS } from './types';
import { moveBonusFor } from './progress';

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
    result,
    progress,
    playLevel,
    nextLevel,
    restartLevel,
    combo,
    feedbackMessage,
    resetProgress,
  } = useGameLogic();

  // The map is the home screen: you pick (or replay) a level there.
  const [screen, setScreen] = useState<'map' | 'game'>('map');

  const progressPercent = Math.min((score / currentLevel.targetScore) * 100, 100);
  const isLastLevel = currentLevel.number === LEVELS[LEVELS.length - 1].number;
  const mascot = currentLevel.characters[0];
  const best = progress.best[currentLevel.number];

  const playFromMap = (index: number) => {
    playLevel(index);
    setScreen('game');
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-gelato-bg bg-[radial-gradient(circle_at_50%_-10%,#3A2620_0%,#1B1311_60%)] overflow-hidden">
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

      {screen === 'map' ? (
        <LevelMap progress={progress} onPlay={playFromMap} onReset={resetProgress} />
      ) : (
        <div className="relative z-10 min-h-[100dvh] flex flex-col items-center justify-center px-4 py-3">
          <div className="w-full max-w-[520px] flex flex-col gap-3 md:gap-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img src="/favicon.svg" alt="" className="w-9 h-9" />
                <h1 className="font-display text-[26px] md:text-3xl leading-none">
                  Brainrot <span className="text-gelato-strawberry">Crush</span>
                </h1>
              </div>
              <button
                onClick={() => setScreen('map')}
                aria-label="Level map"
                title="Level map"
                className="w-11 h-11 rounded-[14px] bg-gelato-raised hover:bg-gelato-tray text-gelato-soft flex items-center justify-center shadow-bevel transition-colors"
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Level progress */}
            <div className="bg-gelato-surface rounded-[20px] px-4 pt-3.5 pb-3 flex flex-col gap-2.5 shadow-bevel">
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
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-black tracking-[0.12em] text-gelato-muted">
                {best ? (
                  <>
                    <span>BEST <span className="text-gelato-cream">{best.score}</span></span>
                    <Stars earned={best.stars} size="w-3.5 h-3.5" />
                  </>
                ) : (
                  <span>NO BEST YET</span>
                )}
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
        </div>
      )}

      {/* Level Complete Modal */}
      <AnimatePresence>
        {screen === 'game' && result && (
          <Modal>
            <div className="flex items-end gap-1.5" role="img" aria-label={`${result.stars} of 3 stars`}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: i === 0 ? -12 : i === 2 ? 12 : 0 }}
                  transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 300, damping: 14 }}
                >
                  <StarIcon className={`${i === 1 ? 'w-[76px] h-[76px]' : 'w-[54px] h-[54px]'} ${i < result.stars ? 'text-gelato-lemon' : 'text-gelato-line'}`} />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-[13px] font-black tracking-[0.15em] text-gelato-lemon">LEVEL {currentLevel.number} CLEARED</span>
              <h2 className="font-display text-[44px] leading-none text-center">Bellissimo!</h2>
            </div>

            <img src={CHARACTER_IMAGES[mascot]} alt={CHARACTER_NAMES[mascot]} className="w-24 h-24 object-contain" />

            {/* Unused moves become points, so finishing faster beats an old best. */}
            <div className="w-full bg-gelato-bg rounded-2xl px-4 py-3 flex flex-col gap-1.5 font-extrabold text-gelato-soft">
              <div className="flex justify-between">
                <span>Score</span>
                <span className="text-gelato-cream">{result.score}</span>
              </div>
              <div className="flex justify-between">
                <span>{result.movesLeft} moves left × {moveBonusFor(currentLevel.targetScore)}</span>
                <span className="text-gelato-cream">+{result.bonus}</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-gelato-surface pt-1.5">
                <span className="font-black text-gelato-cream">Total</span>
                <span className="font-display text-2xl text-gelato-cream">{result.total}</span>
              </div>
            </div>

            <div className="w-full flex gap-2.5">
              <Stat label={result.isNewBest ? 'NEW BEST!' : 'BEST'} value={Math.max(result.total, result.previousBest)} highlight={result.isNewBest} />
            </div>

            <div className="w-full flex flex-col gap-2.5">
              {!isLastLevel && (
                <PrimaryButton onClick={nextLevel}>
                  Next level <NextIcon className="w-5 h-5" />
                </PrimaryButton>
              )}
              <div className="flex gap-2.5">
                <SecondaryButton onClick={restartLevel}>
                  <RetryIcon className="w-5 h-5" /> {result.stars < 3 ? 'Go for 3★' : 'Replay'}
                </SecondaryButton>
                <SecondaryButton onClick={() => setScreen('map')}>
                  <MapIcon className="w-5 h-5" /> Map
                </SecondaryButton>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {screen === 'game' && moves === 0 && !result && (
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

            <div className="w-full flex flex-col gap-2.5">
              <PrimaryButton onClick={restartLevel}>
                <RetryIcon className="w-5 h-5" /> Try again
              </PrimaryButton>
              <SecondaryButton onClick={() => setScreen('map')}>
                <MapIcon className="w-5 h-5" /> Back to map
              </SecondaryButton>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
