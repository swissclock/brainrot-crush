import { LEVELS } from './types';

export interface LevelBest {
    score: number;
    stars: number;
}

export interface Progress {
    // Index of the highest level the player may start. Everything at or below it is open.
    unlocked: number;
    // Best result per level number.
    best: Record<number, LevelBest>;
}

const PROGRESS_KEY = 'brainrot_progress';
// Before the level map existed, the only saved state was the current level index.
const LEGACY_LEVEL_KEY = 'brainrot_level';

const clampIndex = (n: number) => Math.min(Math.max(0, Math.floor(n)), LEVELS.length - 1);

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

// localStorage is user-writable and survives reloads, so everything read back is validated:
// a corrupted save must fall back to a fresh start, never to a broken game.
export const loadProgress = (): Progress => {
    try {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (raw) {
            const parsed: unknown = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                const { unlocked, best } = parsed as Record<string, unknown>;
                const cleanBest: Record<number, LevelBest> = {};
                if (best && typeof best === 'object') {
                    for (const [key, value] of Object.entries(best)) {
                        const level = Number(key);
                        const entry = value as Record<string, unknown> | null;
                        if (!Number.isInteger(level) || level < 1 || level > LEVELS.length || !entry) continue;
                        if (!isFiniteNumber(entry.score) || !isFiniteNumber(entry.stars)) continue;
                        cleanBest[level] = {
                            score: Math.max(0, Math.floor(entry.score)),
                            stars: Math.min(3, Math.max(1, Math.floor(entry.stars))),
                        };
                    }
                }
                return { unlocked: isFiniteNumber(unlocked) ? clampIndex(unlocked) : 0, best: cleanBest };
            }
        }

        // First run with the map: carry over how far the old save got.
        const legacy = Number.parseInt(localStorage.getItem(LEGACY_LEVEL_KEY) ?? '', 10);
        return { unlocked: Number.isInteger(legacy) ? clampIndex(legacy) : 0, best: {} };
    } catch {
        // Private browsing, blocked storage or bad JSON: start fresh.
        return { unlocked: 0, best: {} };
    }
};

export const saveProgress = (progress: Progress) => {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
        // Storage unavailable: progress just won't persist.
    }
};

export const clearProgress = () => {
    try {
        localStorage.removeItem(PROGRESS_KEY);
        localStorage.removeItem(LEGACY_LEVEL_KEY);
    } catch {
        // Storage unavailable; the in-memory reset is what matters.
    }
};

// Stars are earned on how many moves are left when the target is reached.
export const starsFor = (movesLeft: number, totalMoves: number) => {
    const ratio = movesLeft / totalMoves;
    if (ratio >= 0.3) return 3;
    if (ratio >= 0.1) return 2;
    return 1;
};

// Unused moves turn into points when a level is cleared, so a replay that finishes in fewer
// moves beats the old best. Scaled to the target so it matters on every level.
export const moveBonusFor = (targetScore: number) => Math.max(5, Math.round(targetScore / 20));
