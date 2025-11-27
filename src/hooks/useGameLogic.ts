import { useState, useEffect, useCallback } from 'react';
import type { Grid, Tile, TileType } from '../types';
import { BOARD_SIZE, LEVELS } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateRandomTile = (availableTypes: TileType[]): Tile => ({
    id: uuidv4(),
    type: availableTypes[Math.floor(Math.random() * availableTypes.length)],
    special: null,
});

const createInitialGrid = (availableTypes: TileType[]): Grid => {
    const grid: Grid = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
        const currentRow: Tile[] = [];
        for (let col = 0; col < BOARD_SIZE; col++) {
            let tile = generateRandomTile(availableTypes);
            while (
                (col >= 2 && currentRow[col - 1].type === tile.type && currentRow[col - 2].type === tile.type) ||
                (row >= 2 && grid[row - 1][col]!.type === tile.type && grid[row - 2][col]!.type === tile.type)
            ) {
                tile = generateRandomTile(availableTypes);
            }
            currentRow.push(tile);
        }
        grid.push(currentRow);
    }
    return grid;
};

export const useGameLogic = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
        const saved = localStorage.getItem('brainrot_level');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [grid, setGrid] = useState<Grid>([]);
    const [selectedTile, setSelectedTile] = useState<{ r: number; c: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [combo, setCombo] = useState(0);
    const [lastMoveScore, setLastMoveScore] = useState(0);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

    const currentLevel = LEVELS[currentLevelIndex];

    useEffect(() => {
        localStorage.setItem('brainrot_level', currentLevelIndex.toString());
    }, [currentLevelIndex]);

    useEffect(() => {
        setGrid(createInitialGrid(currentLevel.characters));
        setMoves(currentLevel.moves);
        setScore(0); // Reset score when level changes
        setCombo(0); // Reset combo
        setSelectedTile(null); // Clear selected tile
        setIsProcessing(false); // Ensure not processing
        setShowLevelComplete(false); // Hide level complete message
        setLastMoveScore(0); // Reset last move score
        setFeedbackMessage(null); // Clear feedback message
    }, [currentLevel]);

    const findMatches = (currentGrid: Grid) => {
        const matches: { r: number; c: number; count: number; horizontal: boolean; isLT: boolean }[] = [];
        const matchedPositions = new Set<string>();

        // Horizontal matches
        for (let r = 0; r < BOARD_SIZE; r++) {
            let matchStart = 0;
            for (let c = 1; c <= BOARD_SIZE; c++) {
                const current = currentGrid[r][c];
                const prev = currentGrid[r][c - 1];

                if (c === BOARD_SIZE || !current || !prev || current.type !== prev.type) {
                    const matchLength = c - matchStart;
                    if (matchLength >= 3) {
                        for (let i = matchStart; i < c; i++) {
                            matches.push({ r, c: i, count: matchLength, horizontal: true, isLT: false });
                            matchedPositions.add(`${r},${i}`);
                        }
                    }
                    matchStart = c;
                }
            }
        }

        // Vertical matches
        for (let c = 0; c < BOARD_SIZE; c++) {
            let matchStart = 0;
            for (let r = 1; r <= BOARD_SIZE; r++) {
                const current = currentGrid[r]?.[c];
                const prev = currentGrid[r - 1]?.[c];

                if (r === BOARD_SIZE || !current || !prev || current.type !== prev.type) {
                    const matchLength = r - matchStart;
                    if (matchLength >= 3) {
                        for (let i = matchStart; i < r; i++) {
                            const key = `${i},${c}`;
                            const isLT = matchedPositions.has(key); // L or T shape!
                            matches.push({ r: i, c, count: matchLength, horizontal: false, isLT });
                        }
                    }
                    matchStart = r;
                }
            }
        }

        return matches;
    };

    const hasLegalMoves = (currentGrid: Grid): boolean => {
        // Check all possible swaps
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                // Try swapping right
                if (c < BOARD_SIZE - 1) {
                    const testGrid = currentGrid.map(row => [...row]);
                    const temp = testGrid[r][c];
                    testGrid[r][c] = testGrid[r][c + 1];
                    testGrid[r][c + 1] = temp;
                    if (findMatches(testGrid).length > 0) return true;
                }
                // Try swapping down
                if (r < BOARD_SIZE - 1) {
                    const testGrid = currentGrid.map(row => [...row]);
                    const temp = testGrid[r][c];
                    testGrid[r][c] = testGrid[r + 1][c];
                    testGrid[r + 1][c] = temp;
                    if (findMatches(testGrid).length > 0) return true;
                }
            }
        }
        return false;
    };

    const reshuffleGrid = () => {
        setGrid(prev => {
            const tiles: Tile[] = [];
            prev.forEach(row => row.forEach(tile => {
                if (tile) tiles.push({ ...tile, id: uuidv4(), special: null });
            }));

            // Fisher-Yates shuffle
            for (let i = tiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
            }

            const newGrid: Grid = [];
            for (let r = 0; r < BOARD_SIZE; r++) {
                newGrid.push(tiles.slice(r * BOARD_SIZE, (r + 1) * BOARD_SIZE));
            }
            return newGrid;
        });
        setFeedbackMessage('🔄 RESHUFFLED!');
        setTimeout(() => setFeedbackMessage(null), 2000);
    };

    const applyGravity = (currentGrid: Grid) => {
        const newGrid = currentGrid.map(row => [...row]);

        for (let c = 0; c < BOARD_SIZE; c++) {
            let emptyRow = BOARD_SIZE - 1;
            for (let r = BOARD_SIZE - 1; r >= 0; r--) {
                if (newGrid[r][c]) {
                    if (r !== emptyRow) {
                        newGrid[emptyRow][c] = newGrid[r][c];
                        newGrid[r][c] = null;
                    }
                    emptyRow--;
                }
            }
        }

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (!newGrid[r][c]) {
                    newGrid[r][c] = generateRandomTile(currentLevel.characters);
                }
            }
        }
        return newGrid;
    };

    const activateSpecialTile = (grid: Grid, r: number, c: number): { r: number; c: number }[] => {
        const tile = grid[r][c];
        if (!tile || !tile.special) return [];

        const toRemove: { r: number; c: number }[] = [];

        // Check for special tile combinations
        const adjacentSpecials: { r: number; c: number; tile: Tile }[] = [];
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                const adjacentTile = grid[nr][nc];
                if (adjacentTile?.special) {
                    adjacentSpecials.push({ r: nr, c: nc, tile: adjacentTile });
                }
            }
        }

        // STRIPE + BOMB COMBO = CLEAR ENTIRE BOARD!
        const isStriped = tile.special === 'striped-h' || tile.special === 'striped-v';
        const isBomb = tile.special === 'bomb' || tile.special === 'mega-bomb';

        for (const adjacent of adjacentSpecials) {
            const adjIsStriped = adjacent.tile.special === 'striped-h' || adjacent.tile.special === 'striped-v';
            const adjIsBomb = adjacent.tile.special === 'bomb' || adjacent.tile.special === 'mega-bomb';

            if ((isStriped && adjIsBomb) || (isBomb && adjIsStriped)) {
                // MEGA COMBO! Clear entire board
                for (let row = 0; row < BOARD_SIZE; row++) {
                    for (let col = 0; col < BOARD_SIZE; col++) {
                        toRemove.push({ r: row, c: col });
                    }
                }
                setFeedbackMessage('MEGA COMBO! BOARD CLEAR!');
                setTimeout(() => setFeedbackMessage(null), 3000);
                return toRemove;
            }
        }

        // Normal special tile behavior
        if (tile.special === 'striped-h') {
            for (let col = 0; col < BOARD_SIZE; col++) {
                toRemove.push({ r, c: col });
            }
        } else if (tile.special === 'striped-v') {
            for (let row = 0; row < BOARD_SIZE; row++) {
                toRemove.push({ r: row, c });
            }
        } else if (tile.special === 'bomb') {
            const targetType = tile.type;
            for (let row = 0; row < BOARD_SIZE; row++) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (grid[row][col]?.type === targetType) {
                        toRemove.push({ r: row, c: col });
                    }
                }
            }
        } else if (tile.special === 'mega-bomb') {
            // Clear 3x3 area around the tile
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE) {
                        toRemove.push({ r: nr, c: nc });
                    }
                }
            }
        }

        return toRemove;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const matches = findMatches(grid);

            if (matches.length > 0) {
                setIsProcessing(true);

                // Determine special tile type
                const hasLT = matches.some(m => m.isLT);
                const match6 = matches.find(m => m.count >= 6);
                const match5 = matches.find(m => m.count === 5);
                const match4 = matches.find(m => m.count === 4);

                let specialTilePos: { r: number; c: number; type: 'striped-h' | 'striped-v' | 'bomb' | 'mega-bomb' } | null = null;

                if (match6) {
                    specialTilePos = { r: match6.r, c: match6.c, type: 'mega-bomb' };
                } else if (hasLT) {
                    const ltMatch = matches.find(m => m.isLT);
                    if (ltMatch) {
                        specialTilePos = { r: ltMatch.r, c: ltMatch.c, type: 'mega-bomb' };
                    }
                } else if (match5) {
                    specialTilePos = { r: match5.r, c: match5.c, type: 'bomb' };
                } else if (match4) {
                    specialTilePos = {
                        r: match4.r,
                        c: match4.c,
                        type: match4.horizontal ? 'striped-h' : 'striped-v'
                    };
                }

                // Calculate removals and score
                const specialRemoves: { r: number; c: number }[] = [];
                const tempGrid = grid.map(row => [...row]);

                matches.forEach(({ r, c }) => {
                    const tile = tempGrid[r][c];
                    if (tile?.special) {
                        specialRemoves.push(...activateSpecialTile(tempGrid, r, c));
                    }
                });

                const allRemoves = [...matches, ...specialRemoves];
                const uniqueRemoves = Array.from(
                    new Set(allRemoves.map(m => `${m.r},${m.c}`))
                ).map(s => {
                    const [r, c] = s.split(',').map(Number);
                    return { r, c };
                });

                // Calculate Score
                const totalRemoved = uniqueRemoves.length;
                let extraPoints = Math.floor(totalRemoved * 10 * (1 + combo * 0.1));

                if (match6) extraPoints += 500;
                else if (hasLT) extraPoints += 300;
                else if (match5) extraPoints += 200;
                else if (match4) extraPoints += 100;

                setScore(s => s + extraPoints);
                setLastMoveScore(prev => prev + extraPoints);
                setCombo(c => c + 1);

                // Feedback
                if (match6) {
                    setFeedbackMessage('🌈 GODLIKE! 6 MATCH!');
                    setTimeout(() => setFeedbackMessage(null), 2500);
                } else if (hasLT) {
                    setFeedbackMessage('⭐ L-SHAPE BONUS!');
                    setTimeout(() => setFeedbackMessage(null), 2000);
                } else if (extraPoints >= 200) {
                    setFeedbackMessage('🔥 AMAZING!');
                    setTimeout(() => setFeedbackMessage(null), 2000);
                } else if (combo >= 3) {
                    setFeedbackMessage(`💥 ${combo}x COMBO!`);
                    setTimeout(() => setFeedbackMessage(null), 2000);
                }

                // Apply changes to grid
                setGrid(prev => {
                    const newGrid = prev.map(row => [...row]);

                    uniqueRemoves.forEach(({ r, c }) => {
                        newGrid[r][c] = null;
                    });

                    if (specialTilePos && newGrid[specialTilePos.r][specialTilePos.c] === null) {
                        newGrid[specialTilePos.r][specialTilePos.c] = {
                            id: uuidv4(),
                            type: currentLevel.characters[0], // Default type, will be overwritten if needed or random
                            special: specialTilePos.type,
                        };
                        newGrid[specialTilePos.r][specialTilePos.c]!.type =
                            grid[specialTilePos.r][specialTilePos.c]?.type || currentLevel.characters[0];
                    }

                    const filledGrid = applyGravity(newGrid);
                    return filledGrid;
                });
            } else {
                // No matches found. Check for deadlock.
                if (grid.length > 0 && !hasLegalMoves(grid)) {
                    reshuffleGrid();
                } else {
                    setIsProcessing(false);
                    setCombo(0);
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [grid, currentLevel.characters]); // Removed isProcessing and combo from dependencies to prevent loops

    useEffect(() => {
        if (score >= currentLevel.targetScore && !showLevelComplete) {
            setShowLevelComplete(true);
        }
    }, [score, currentLevel.targetScore, showLevelComplete]);

    const swapTiles = useCallback((r1: number, c1: number, r2: number, c2: number) => {
        const testGrid = grid.map(row => [...row]);
        const tile1 = testGrid[r1][c1];
        const tile2 = testGrid[r2][c2];

        if (!tile1 || !tile2) return;

        // Check for Special + Special Combo
        if (tile1.special && tile2.special) {
            // Trigger Mega Combo!
            setGrid(testGrid); // No swap needed visually, just trigger effect
            setIsProcessing(true);
            setLastMoveScore(0);

            // Handle combo logic
            const comboRemoves: { r: number; c: number }[] = [];

            // 1. Bomb + Bomb = Mega Explosion (Clear board)
            if ((tile1.special === 'bomb' || tile1.special === 'mega-bomb') &&
                (tile2.special === 'bomb' || tile2.special === 'mega-bomb')) {
                for (let r = 0; r < BOARD_SIZE; r++) {
                    for (let c = 0; c < BOARD_SIZE; c++) {
                        comboRemoves.push({ r, c });
                    }
                }
                setFeedbackMessage('💥 SUPERNOVA!');
            }
            // 2. Stripe + Stripe = Cross (Row + Col)
            else if ((tile1.special === 'striped-h' || tile1.special === 'striped-v') &&
                (tile2.special === 'striped-h' || tile2.special === 'striped-v')) {
                for (let c = 0; c < BOARD_SIZE; c++) comboRemoves.push({ r: r1, c }); // Row 1
                for (let c = 0; c < BOARD_SIZE; c++) comboRemoves.push({ r: r2, c }); // Row 2 (if different)
                for (let r = 0; r < BOARD_SIZE; r++) comboRemoves.push({ r, c: c1 }); // Col 1
                for (let r = 0; r < BOARD_SIZE; r++) comboRemoves.push({ r, c: c2 }); // Col 2
                setFeedbackMessage('✨ CROSS BLAST!');
            }
            // 3. Stripe + Bomb = 3 Rows + 3 Cols
            else if ((tile1.special?.includes('striped') && tile2.special?.includes('bomb')) ||
                (tile2.special?.includes('striped') && tile1.special?.includes('bomb'))) {
                for (let r = Math.max(0, r1 - 1); r <= Math.min(BOARD_SIZE - 1, r1 + 1); r++) {
                    for (let c = 0; c < BOARD_SIZE; c++) comboRemoves.push({ r, c });
                }
                for (let c = Math.max(0, c1 - 1); c <= Math.min(BOARD_SIZE - 1, c1 + 1); c++) {
                    for (let r = 0; r < BOARD_SIZE; r++) comboRemoves.push({ r, c });
                }
                setFeedbackMessage('🚀 MEGA BEAM!');
            }

            // Execute combo removal
            setTimeout(() => {
                // Calculate score for combo
                const comboPoints = comboRemoves.length * 50;
                setScore(s => s + comboPoints);

                setGrid(prev => {
                    const newGrid = prev.map(row => [...row]);
                    comboRemoves.forEach(({ r, c }) => {
                        newGrid[r][c] = null;
                    });

                    const filledGrid = applyGravity(newGrid);
                    return filledGrid;
                });
                setIsProcessing(false);
            }, 300);
            return;
        }

        // Normal Swap Logic
        testGrid[r1][c1] = tile2;
        testGrid[r2][c2] = tile1;

        const matches = findMatches(testGrid);

        if (matches.length > 0) {
            setGrid(testGrid);
            setIsProcessing(true);
            setLastMoveScore(0);
        } else {
            // Revert if no match
            setGrid(prev => {
                const newGrid = [...prev.map(row => [...row])];
                newGrid[r1][c1] = tile2;
                newGrid[r2][c2] = tile1;
                return newGrid;
            });

            setTimeout(() => {
                setGrid(prev => {
                    const newGrid = [...prev.map(row => [...row])];
                    newGrid[r1][c1] = tile1;
                    newGrid[r2][c2] = tile2;
                    return newGrid;
                });
            }, 200);
        }
    }, [grid]);

    const handleTileClick = (r: number, c: number) => {
        if (isProcessing || moves <= 0) return;

        if (!selectedTile) {
            setSelectedTile({ r, c });
        } else {
            const { r: selectedR, c: selectedC } = selectedTile;

            const isAdjacent =
                (Math.abs(selectedR - r) === 1 && selectedC === c) ||
                (Math.abs(selectedC - c) === 1 && selectedR === r);

            if (isAdjacent) {
                swapTiles(selectedR, selectedC, r, c);
                setMoves(m => m - 1);
                setSelectedTile(null);
            } else {
                setSelectedTile({ r, c });
            }
        }
    };

    const nextLevel = () => {
        const nextLevelIndex = LEVELS.findIndex(l => l.number === currentLevel.number) + 1;
        if (nextLevelIndex < LEVELS.length) {
            setCurrentLevelIndex(nextLevelIndex);
            // Grid and stats reset is handled by useEffect on currentLevel change
        }
    };

    const restartLevel = () => {
        setGrid(createInitialGrid(currentLevel.characters));
        setMoves(currentLevel.moves);
        setScore(0);
        setShowLevelComplete(false);
        setCombo(0);
    };

    const resetProgress = () => {
        localStorage.removeItem('brainrot_level');
        setCurrentLevelIndex(0);
        // Grid and stats reset is handled by useEffect on currentLevel change
    };

    return {
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
        lastMoveScore,
        feedbackMessage,
        resetProgress,
    };
};
