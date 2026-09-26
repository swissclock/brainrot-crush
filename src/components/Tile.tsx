import React from 'react';
import { motion } from 'framer-motion';
import type { Tile as TileType } from '../types';
import { BombIcon, FireIcon } from './Icons';

import { CHARACTER_IMAGES } from '../characterImages';

// One flavour per character slot in the level, so tiles on the same board never share a
// colour. A level has at most six characters.
const FLAVORS = [
    'bg-scoop-blueberry',
    'bg-scoop-hazelnut',
    'bg-scoop-strawberry',
    'bg-scoop-pistachio',
    'bg-scoop-lavender',
    'bg-scoop-lemon',
];

interface TileProps {
    tile: TileType;
    flavor: number;
    isSelected: boolean;
    onClick: () => void;
    onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
    style?: React.CSSProperties;
}

export const Tile: React.FC<TileProps> = ({ tile, flavor, isSelected, onClick, onSwipe, style }) => {
    // Track if a swap has already been triggered for the current drag gesture
    const hasSwapped = React.useRef(false);

    const getSpecialRing = () => {
        if (tile.special === 'mega-bomb') return 'ring-[3px] ring-inset ring-gelato-strawberry';
        if (tile.special === 'bomb') return 'ring-[3px] ring-inset ring-gelato-lemon';
        return '';
    };

    const getSpecialOverlay = () => {
        if (tile.special === 'striped-h') {
            return (
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1 right-1 h-1 -mt-0.5 rounded-full bg-white shadow-[0_0_6px_white]" />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            );
        } else if (tile.special === 'striped-v') {
            return (
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                    <div className="absolute left-1/2 top-1 bottom-1 w-1 -ml-0.5 rounded-full bg-white shadow-[0_0_6px_white]" />
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-transparent"
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            );
        } else if (tile.special === 'bomb') {
            return (
                <motion.div
                    className="absolute -bottom-1 -right-1 pointer-events-none"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <BombIcon className="w-5 h-5 md:w-7 md:h-7" />
                </motion.div>
            );
        } else if (tile.special === 'mega-bomb') {
            return (
                <motion.div
                    className="absolute -bottom-1 -right-1 pointer-events-none"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    <FireIcon className="w-5 h-5 md:w-7 md:h-7" />
                </motion.div>
            );
        }
        return null;
    };

    // Determine exit animation based on tile type
    const getExitAnimation = () => {
        if (tile.special === 'mega-bomb') {
            // Massive explosion - Toned down
            return {
                scale: 1.5,
                opacity: 0,
                transition: { duration: 0.4, ease: 'circOut' }
            };
        }
        if (tile.special === 'bomb') {
            // Explosion - Toned down
            return {
                scale: 1.2,
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeOut' }
            };
        }
        if (tile.special === 'striped-h') {
            // Horizontal beam
            return {
                scaleX: 5,
                scaleY: 0.5,
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' }
            };
        }
        if (tile.special === 'striped-v') {
            // Vertical beam
            return {
                scaleY: 5,
                scaleX: 0.5,
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' }
            };
        }
        // Normal pop
        return {
            scale: 0,
            opacity: 0,
            rotate: 180,
            transition: { duration: 0.3, ease: 'backIn' }
        };
    };

    return (
        // Only transform and opacity are animated here: they stay on the compositor. Animating
        // `filter` on all 64 tiles (plus a backdrop blur and drop-shadow per tile) gave each
        // tile its own offscreen buffers, and mobile Safari kills the page once those pile up.
        <motion.div
            layout
            initial={{ y: -50, opacity: 1, scale: 0.5 }} // Falling animation
            animate={{
                y: 0,
                scale: isSelected ? 1.08 : 1,
                opacity: 1,
                rotate: 0,
                zIndex: 1,
            }}
            exit={getExitAnimation() as any}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 1
            }}
            whileHover={{
                scale: 1.05,
                zIndex: 20,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            drag={!!onSwipe}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            dragSnapToOrigin={true}
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            onTap={() => onClick()}
            onDragStart={() => {
                hasSwapped.current = false;
            }}
            onDrag={(_e, { offset }) => {
                if (!onSwipe || hasSwapped.current) return;

                const swipeThreshold = 10; // Lower threshold for better sensitivity
                const { x, y } = offset;

                // Prioritize the dominant axis
                if (Math.abs(x) > Math.abs(y)) {
                    if (Math.abs(x) > swipeThreshold) {
                        hasSwapped.current = true;
                        onSwipe(x > 0 ? 'right' : 'left');
                    }
                } else {
                    if (Math.abs(y) > swipeThreshold) {
                        hasSwapped.current = true;
                        onSwipe(y > 0 ? 'down' : 'up');
                    }
                }
            }}
            style={style}
            className={`
        w-full h-full aspect-square relative cursor-pointer rounded-xl
        flex items-center justify-center touch-none select-none
        ${FLAVORS[flavor % FLAVORS.length]} shadow-tile
        ${isSelected ? 'ring-[3px] ring-gelato-strawberry ring-offset-[3px] ring-offset-gelato-cream z-10' : getSpecialRing()}
        -webkit-tap-highlight-color-transparent
      `}
        >
            <img
                src={CHARACTER_IMAGES[tile.type]}
                alt={tile.type}
                draggable={false}
                className="w-[92%] h-[92%] object-contain select-none pointer-events-none"
            />

            {getSpecialOverlay()}

            {tile.special && (
                // Pulse the opacity of a fixed glow rather than animating box-shadow,
                // which repaints the tile on every frame.
                <motion.div
                    className={`absolute inset-0 rounded-xl pointer-events-none ${tile.special === 'mega-bomb'
                        ? 'shadow-[0_0_16px_4px_rgba(255,90,135,0.8)]'
                        : 'shadow-[0_0_14px_2px_rgba(255,214,90,0.8)]'}`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            )}
        </motion.div>
    );
};
