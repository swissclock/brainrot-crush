import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Tile } from './Tile';
import type { Grid, TileType } from '../types';

interface GameBoardProps {
    grid: Grid;
    selectedTile: { r: number; c: number } | null;
    onTileClick: (r: number, c: number) => void;
    onTileSwipe: (r: number, c: number, direction: 'up' | 'down' | 'left' | 'right') => void;
    boardId: number;
    characters: TileType[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, selectedTile, onTileClick, onTileSwipe, boardId, characters }) => {

    return (
        <div className="relative bg-gelato-tray rounded-[22px] p-2 shadow-[inset_0_-5px_0_rgba(0,0,0,0.35),0_10px_30px_rgba(0,0,0,0.35)] w-full max-w-[520px] aspect-square mx-auto">
            <div
                className="relative grid grid-cols-8 gap-1 touch-none w-full h-full"
                style={{
                    gridTemplateRows: 'repeat(8, 1fr)',
                    gridTemplateColumns: 'repeat(8, 1fr)'
                }}
            >
                {/* Background Grid (Empty Slots) */}
                {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="w-full h-full bg-gelato-raised rounded-xl" />
                ))}

                {/* Tiles Layer - Rendered as a flat list for Framer Motion layout animations */}
                {/* Keyed by board so a new level or restart replaces the tiles outright
                    instead of animating 64 exits on top of 64 entrances. */}
                <AnimatePresence mode="popLayout" key={boardId}>
                    {grid.flatMap((row, r) =>
                        row.map((tile, c) =>
                            tile ? (
                                <Tile
                                    key={tile.id}
                                    tile={tile}
                                    flavor={Math.max(0, characters.indexOf(tile.type))}
                                    isSelected={selectedTile?.r === r && selectedTile?.c === c}
                                    onClick={() => onTileClick(r, c)}
                                    onSwipe={(direction) => onTileSwipe(r, c, direction)}
                                    style={{
                                        gridColumn: c + 1,
                                        gridRow: r + 1,
                                        zIndex: selectedTile?.r === r && selectedTile?.c === c ? 50 : 10
                                    }}
                                />
                            ) : null
                        )
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
