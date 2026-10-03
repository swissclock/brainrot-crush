import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CHARACTER_NAMES, LEVELS } from '../types';
import type { Progress } from '../progress';
import { CHARACTER_IMAGES } from '../characterImages';
import { LockIcon, StarIcon, TrashIcon } from './Icons';
import { Modal, PrimaryButton, SecondaryButton, Stars, Stat } from './ui';

// The map is the inside of a rotting brain: level 1 starts at the brainstem at the bottom
// and the path winds upward through one lobe per ten levels.
const LEVELS_PER_ZONE = 10;
const ZONES = [
    { name: 'The Brainstem', tint: '#F5B5C8' },
    { name: 'Cerebellum Café', tint: '#E8C79A' },
    { name: 'Temporal Tiramisu', tint: '#F2DE8A' },
    { name: 'Occipital Ocean', tint: '#9FD3E8' },
    { name: 'Parietal Piazza', tint: '#B9DC8E' },
    { name: 'Hippocampo Gelato', tint: '#C9B6E8' },
    { name: 'Amygdala Arcade', tint: '#F5B5C8' },
    { name: 'Frontal Fiesta', tint: '#E8C79A' },
    { name: 'Skibidi Sulcus', tint: '#B9DC8E' },
    { name: 'Peak Brainrot', tint: '#C9B6E8' },
];

const ROW = 96;           // vertical distance between level nodes
const ZONE_HEADER = 96;   // room at the bottom of each lobe, where the path enters, for its name
const ZONE_HEIGHT = LEVELS_PER_ZONE * ROW + ZONE_HEADER;
const STEM = 320;         // the brainstem start area at the bottom (clears the play button)
const CAP = 280;          // the top of the brain
const MAP_HEIGHT = CAP + ZONES.length * ZONE_HEIGHT + STEM;
const NODE = 56;

const zoneOf = (index: number) => ZONES[Math.min(Math.floor(index / LEVELS_PER_ZONE), ZONES.length - 1)];
const zoneTop = (zone: number) => MAP_HEIGHT - STEM - (zone + 1) * ZONE_HEIGHT;

// x is a percentage of the map width so the path fits any phone; y is in px from the top.
const POSITIONS = LEVELS.map((_, i) => {
    const zone = Math.floor(i / LEVELS_PER_ZONE);
    const fromBottom = STEM + zone * ZONE_HEIGHT + ZONE_HEADER + ROW / 2 + (i % LEVELS_PER_ZONE) * ROW;
    return { x: 50 + 28 * Math.sin(i * 0.85 + 0.4), y: MAP_HEIGHT - fromBottom };
});

const pathThrough = (points: { x: number; y: number }[]) =>
    points.map((p, i) => {
        if (i === 0) return `M ${p.x} ${p.y}`;
        const prev = points[i - 1];
        const midY = (prev.y + p.y) / 2;
        return `C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
    }).join(' ');

const FULL_PATH = pathThrough(POSITIONS);

// Brain folds: short curls scattered over each lobe. Placement is pseudo-random but fixed,
// so the map looks the same on every visit.
const LOBE_HEIGHT = ZONE_HEIGHT + 24;
const rand = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};
const CURLS = ZONES.map((_, z) => Array.from({ length: 18 }, (_, i) => {
    const n = z * 100 + i;
    return {
        x: 20 + rand(n) * 340,
        y: 30 + (i / 18) * (LOBE_HEIGHT - 60) + rand(n + 0.5) * 40,
        angle: Math.round(rand(n + 0.7) * 120 - 60),
        flip: rand(n + 0.9) > 0.5 ? -1 : 1,
    };
}));

interface LevelMapProps {
    progress: Progress;
    onPlay: (index: number) => void;
    onReset: () => void;
}

export const LevelMap = ({ progress, onPlay, onReset }: LevelMapProps) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const frontierRef = useRef<HTMLButtonElement>(null);

    // The next level to play: the highest unlocked one.
    const frontier = progress.unlocked;
    const totalStars = Object.values(progress.best).reduce((sum, b) => sum + b.stars, 0);
    const allCleared = !!progress.best[LEVELS[LEVELS.length - 1].number];

    useEffect(() => {
        frontierRef.current?.scrollIntoView({ block: 'center' });
    }, []);

    const unlockedPath = pathThrough(POSITIONS.slice(0, frontier + 1));
    const selectedLevel = selected !== null ? LEVELS[selected] : null;
    const selectedBest = selectedLevel ? progress.best[selectedLevel.number] : undefined;

    return (
        <div className="relative w-full h-[100dvh]">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-gelato-bg via-gelato-bg/90 to-transparent px-4 pt-3 pb-8 pointer-events-none">
                <div className="max-w-[520px] mx-auto flex items-center justify-between gap-3 pointer-events-auto">
                    <div className="flex items-center gap-2 min-w-0">
                        <img src="/favicon.svg" alt="" className="w-9 h-9 shrink-0" />
                        <h1 className="font-display text-[22px] leading-none whitespace-nowrap">
                            Brainrot <span className="text-gelato-strawberry">Crush</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-11 px-3 rounded-[14px] bg-gelato-surface shadow-bevel flex items-center gap-1.5 font-black text-sm whitespace-nowrap" aria-label={`${totalStars} of ${LEVELS.length * 3} stars collected`}>
                            <StarIcon className="w-5 h-5 text-gelato-lemon" />
                            {totalStars}
                            <span className="hidden sm:inline text-gelato-muted font-extrabold">/ {LEVELS.length * 3}</span>
                        </div>
                        <button
                            onClick={() => setConfirmReset(true)}
                            aria-label="Reset progress"
                            title="Reset progress"
                            className="w-11 h-11 rounded-[14px] bg-gelato-raised hover:bg-gelato-tray text-gelato-soft flex items-center justify-center shadow-bevel transition-colors"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrolling map */}
            <div className="h-full overflow-y-auto overscroll-contain touch-pan-y">
                <div className="relative mx-auto max-w-[520px]" style={{ height: MAP_HEIGHT }}>
                    {/* Brain top */}
                    <div className="absolute inset-x-0 top-20 flex flex-col items-center gap-2 text-center px-8">
                        <img src="/favicon.svg" alt="" className="w-24 h-24 rotate-6" />
                        <p className="font-display text-2xl text-gelato-lemon">
                            {allCleared ? 'Full brainrot achieved!' : 'Full brainrot awaits'}
                        </p>
                        <p className="text-sm font-bold text-gelato-faint">Clear all {LEVELS.length} levels to reach the top</p>
                    </div>

                    {/* Lobes, one per zone */}
                    {ZONES.map((zone, z) => (
                        <div
                            key={zone.name}
                            className="absolute overflow-hidden"
                            style={{
                                top: zoneTop(z) - 12,
                                height: ZONE_HEIGHT + 24,
                                left: z % 2 ? '2%' : '6%',
                                right: z % 2 ? '6%' : '2%',
                                borderRadius: z % 2 ? '46% 40% 44% 48% / 12% 14% 12% 13%' : '40% 48% 46% 42% / 14% 12% 13% 12%',
                                backgroundColor: `${zone.tint}22`,
                            }}
                        >
                            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 400 ${LOBE_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
                                {CURLS[z].map((c, i) => (
                                    <path
                                        key={i}
                                        d={`M ${c.x} ${c.y} c 8 ${-12 * c.flip}, 26 ${-12 * c.flip}, 30 0 s 16 ${12 * c.flip}, 28 0`}
                                        transform={`rotate(${c.angle} ${c.x + 29} ${c.y})`}
                                        fill="none"
                                        stroke={`${zone.tint}40`}
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                ))}
                            </svg>
                        </div>
                    ))}

                    {/* The path between levels: lit up to the frontier */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 100 ${MAP_HEIGHT}`} preserveAspectRatio="none" aria-hidden="true">
                        <path d={FULL_PATH} fill="none" stroke="#4A3730" strokeWidth="8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <path d={unlockedPath} fill="none" stroke="#FFF3E2" strokeOpacity="0.6" strokeWidth="8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>

                    {/* Zone names */}
                    {ZONES.map((zone, z) => {
                        const locked = z * LEVELS_PER_ZONE > frontier;
                        return (
                            <div key={zone.name} className="absolute inset-x-0 flex justify-center pointer-events-none" style={{ top: zoneTop(z) + ZONE_HEIGHT - ZONE_HEADER + 26 }}>
                                <div className="px-4 py-1.5 rounded-full bg-gelato-surface shadow-bevel flex items-center gap-2">
                                    {locked && <LockIcon className="w-4 h-4 text-gelato-muted" />}
                                    <span className="font-display text-lg leading-none" style={{ color: locked ? undefined : zone.tint }}>{zone.name}</span>
                                    <span className="text-xs font-black text-gelato-muted">
                                        {z * LEVELS_PER_ZONE + 1}–{(z + 1) * LEVELS_PER_ZONE}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {/* Level nodes */}
                    {LEVELS.map((level, i) => {
                        const { x, y } = POSITIONS[i];
                        const best = progress.best[level.number];
                        const unlocked = i <= frontier;
                        const isFrontier = i === frontier && !best;
                        const tint = zoneOf(i).tint;
                        return (
                            <button
                                key={level.number}
                                ref={i === frontier ? frontierRef : undefined}
                                disabled={!unlocked}
                                onClick={() => setSelected(i)}
                                aria-label={unlocked
                                    ? `Level ${level.number}${best ? `, ${best.stars} stars, best ${best.score}` : ''}`
                                    : `Level ${level.number}, locked`}
                                className={`absolute rounded-full flex items-center justify-center font-display text-xl transition-transform active:scale-95 ${isFrontier
                                    ? 'bg-gelato-strawberry text-gelato-strawberry-ink shadow-button z-10'
                                    : best
                                        ? 'text-gelato-bg shadow-tile'
                                        : unlocked
                                            ? 'bg-gelato-cream text-gelato-bg shadow-tile'
                                            : 'bg-gelato-raised text-gelato-line shadow-bevel cursor-not-allowed'}`}
                                style={{
                                    width: NODE,
                                    height: NODE,
                                    left: `calc(${x}% - ${NODE / 2}px)`,
                                    top: y - NODE / 2,
                                    backgroundColor: best && !isFrontier ? tint : undefined,
                                }}
                            >
                                {unlocked ? level.number : <LockIcon className="w-5 h-5" />}

                                {best && (
                                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gelato-bg rounded-full px-1 py-0.5">
                                        <Stars earned={best.stars} size="w-3.5 h-3.5" label={false} />
                                    </span>
                                )}

                                {isFrontier && (
                                    <>
                                        <motion.span
                                            className="absolute inset-0 rounded-full border-4 border-gelato-strawberry pointer-events-none"
                                            animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
                                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                                        />
                                        <motion.img
                                            src={CHARACTER_IMAGES[level.characters[0]]}
                                            alt=""
                                            className="absolute -top-16 left-1/2 -ml-7 w-14 h-14 object-contain pointer-events-none"
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                                        />
                                    </>
                                )}
                            </button>
                        );
                    })}

                    {/* Brainstem: the start */}
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" style={{ height: STEM }}>
                        <svg width="120" height="150" viewBox="0 0 120 150" aria-hidden="true">
                            <path d="M38 0h44v92a22 22 0 0 1-44 0z" fill="#F5B5C8" fillOpacity="0.35" />
                            <path d="M46 60v58a7 7 0 0 0 14 0V60z" fill="#F5B5C8" fillOpacity="0.35" />
                            <circle cx="53" cy="138" r="6" fill="#F5B5C8" fillOpacity="0.35" />
                            <path d="M66 70v30a6 6 0 0 0 12 0V70z" fill="#F5B5C8" fillOpacity="0.35" />
                        </svg>
                        <p className="font-display text-xl text-gelato-soft -mt-2">Start here</p>
                    </div>

                </div>
            </div>

            {/* Play button */}
            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-gelato-bg via-gelato-bg/90 to-transparent px-4 pt-8 pb-5 pointer-events-none">
                <div className="max-w-[520px] mx-auto pointer-events-auto">
                    <PrimaryButton onClick={() => onPlay(frontier)}>
                        {progress.best[LEVELS[frontier].number] ? 'Replay' : 'Play'} level {LEVELS[frontier].number}
                    </PrimaryButton>
                </div>
            </div>

            {/* Level details */}
            <AnimatePresence>
                {selectedLevel && selected !== null && (
                    <Modal onDismiss={() => setSelected(null)}>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-[13px] font-black tracking-[0.15em] text-gelato-lemon">LEVEL {selectedLevel.number}</span>
                            <h2 className="font-display text-3xl leading-tight" style={{ color: zoneOf(selected).tint }}>{zoneOf(selected).name}</h2>
                        </div>

                        <Stars earned={selectedBest?.stars ?? 0} size="w-10 h-10" />

                        <div className="w-full flex gap-2.5">
                            <Stat label="BEST" value={selectedBest?.score ?? '—'} />
                            <Stat label="TARGET" value={selectedLevel.targetScore} />
                            <Stat label="MOVES" value={selectedLevel.moves} />
                        </div>

                        <div className="flex flex-wrap justify-center gap-1.5">
                            {selectedLevel.characters.map(c => (
                                <img key={c} src={CHARACTER_IMAGES[c]} alt={CHARACTER_NAMES[c]} title={CHARACTER_NAMES[c]} className="w-11 h-11 object-contain" />
                            ))}
                        </div>

                        <div className="w-full flex flex-col gap-2.5">
                            <PrimaryButton onClick={() => onPlay(selected)}>
                                {selectedBest ? 'Beat your best' : 'Play'}
                            </PrimaryButton>
                            <SecondaryButton onClick={() => setSelected(null)}>Close</SecondaryButton>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* Reset confirmation */}
            <AnimatePresence>
                {confirmReset && (
                    <Modal onDismiss={() => setConfirmReset(false)}>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h2 className="font-display text-3xl leading-tight">Start over?</h2>
                            <p className="font-semibold text-gelato-soft">
                                This deletes every best score and star, and locks everything after level 1.
                            </p>
                        </div>
                        <div className="w-full flex flex-col gap-2.5">
                            <PrimaryButton onClick={() => { onReset(); setConfirmReset(false); }}>
                                Yes, reset
                            </PrimaryButton>
                            <SecondaryButton onClick={() => setConfirmReset(false)}>Cancel</SecondaryButton>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};
