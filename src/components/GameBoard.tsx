import React, { useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Tile } from './Tile';
import type { Grid } from '../types';

interface GameBoardProps {
    grid: Grid;
    selectedTile: { r: number; c: number } | null;
    onTileClick: (r: number, c: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, selectedTile, onTileClick }) => {
    const boardRef = useRef<HTMLDivElement>(null);

    const handleSwipe = useCallback((r: number, c: number, direction: 'up' | 'down' | 'left' | 'right') => {
        let targetR = r;
        let targetC = c;

        switch (direction) {
            case 'up': targetR--; break;
            case 'down': targetR++; break;
            case 'left': targetC--; break;
            case 'right': targetC++; break;
        }

        // Check bounds
        if (targetR >= 0 && targetR < 8 && targetC >= 0 && targetC < 8) {
            // Trigger swap!
            // If start tile isn't selected, select it first
            if (!selectedTile || selectedTile.r !== r || selectedTile.c !== c) {
                onTileClick(r, c);
            }
            // Then click the target tile to swap
            onTileClick(targetR, targetC);
        }
    }, [selectedTile, onTileClick]);

    return (
        <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-3 border-2 border-purple-500/30 shadow-2xl">
            <div
                ref={boardRef}
                className="grid grid-cols-8 gap-1.5 touch-none"
                style={{ width: 'min(90vw, 500px)', height: 'min(90vw, 500px)' }}
            >
                {grid.map((row, r) => (
                    row.map((tile, c) => (
                        <div key={`${r}-${c}`} className="relative w-full h-full">
                            <AnimatePresence mode="popLayout">
                                {tile && (
                                    <Tile
                                        key={tile.id}
                                        tile={tile}
                                        isSelected={selectedTile?.r === r && selectedTile?.c === c}
                                        onClick={() => onTileClick(r, c)}
                                        onSwipe={(direction) => handleSwipe(r, c, direction)}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
};
