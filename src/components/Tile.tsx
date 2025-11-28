import React from 'react';
import { motion } from 'framer-motion';
import type { Tile as TileType } from '../types';
import { BombIcon, FireIcon } from './Icons';

// Import character images (transparent background versions)
import tralalero from '../assets/tralalerotralala_bg.png';
import tung from '../assets/tungtungtungtungtungtungtungtungtungsahur_bg.png';
import ballerina from '../assets/ballerinacappucina_bg.png';
import brr from '../assets/brrbrrpatapim_bg.png';
import bombardilo from '../assets/bombardirocrocodilo_bg.png';
import cappuccino from '../assets/cappuccinoassassino_bg.png';
import lirili from '../assets/lirililarila_bg.png';
import garamararam from '../assets/udindindindindunmadindindindun_bg.png';
import tralaleritos from '../assets/trictracbaraboom_bg.png';
import chicleteira from '../assets/frigocamelo_bg.png';
import trippi from '../assets/trippitroppi_bg.png';
import chimpanzini from '../assets/chimpanzinibananini_bg.png';
import ballerinolololo from '../assets/ballerinolololo_bg.png';
import bobrito from '../assets/bobritobandito_bg.png';
import bombombini from '../assets/bombombinigusini_bg.png';
import boneca from '../assets/bonecaambalabu_bg.png';
import briibrii from '../assets/briibriibicusdicusbombicus_bg.png';
import burbaloni from '../assets/burbalonilulilolli_bg.png';
import chaimaestro from '../assets/chaimaestro_bg.png';
import cocofanto from '../assets/cocofantoelefanto_bg.png';
import espressona from '../assets/espressonasignora_bg.png';
import frigocamelo from '../assets/frigocamelo_bg.png';
import frulifrula from '../assets/frulifrula_bg.png';
import girafaceleste from '../assets/girafaceleste_bg.png';
import laesok from '../assets/laesoksikola_bg.png';
import matteo from '../assets/matteooooooooooooo_bg.png';
import orangutini from '../assets/orangutiniananasini_bg.png';
import orcalero from '../assets/orcaleroorcala_bg.png';
import rhinotoasterino from '../assets/rhinotoasterino_bg.png';
import sigmaboy from '../assets/sigmaboy_bg.png';
import tobtobi from '../assets/tobtobitobtobtobitob_bg.png';
import tracotucotulu from '../assets/tracotucotuludelapeladustuz_bg.png';
import zibrazubra from '../assets/zibrazubrazibralini_bg.png';

const CHARACTER_IMAGES = {
    tralalero,
    tung,
    ballerina,
    brr,
    bombardilo,
    cappuccino,
    lirili,
    garamararam,
    tralaleritos,
    chicleteira,
    trippi,
    chimpanzini,
    ballerinolololo,
    bobrito,
    bombombini,
    boneca,
    briibrii,
    burbaloni,
    chaimaestro,
    cocofanto,
    espressona,
    frigocamelo,
    frulifrula,
    girafaceleste,
    laesok,
    matteo,
    orangutini,
    orcalero,
    rhinotoasterino,
    sigmaboy,
    tobtobi,
    tracotucotulu,
    zibrazubra,
};

interface TileProps {
    tile: TileType;
    isSelected: boolean;
    onClick: () => void;
    onSwipe?: (direction: 'up' | 'down' | 'left' | 'right') => void;
    style?: React.CSSProperties;
}

export const Tile: React.FC<TileProps> = ({ tile, isSelected, onClick, onSwipe, style }) => {
    // Track if a swap has already been triggered for the current drag gesture
    const hasSwapped = React.useRef(false);

    const getSpecialStyle = () => {
        if (tile.special === 'striped-h') {
            return 'bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-yellow-400/30';
        } else if (tile.special === 'striped-v') {
            return 'bg-gradient-to-b from-yellow-400/30 via-orange-500/30 to-yellow-400/30';
        } else if (tile.special === 'bomb') {
            return 'bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-purple-500/30';
        } else if (tile.special === 'mega-bomb') {
            return 'bg-gradient-to-br from-red-600/40 via-orange-500/40 to-yellow-400/40 animate-pulse';
        }
        return 'bg-white/5'; // Subtle glass background for normal tiles
    };

    const getSpecialGlow = () => {
        if (tile.special === 'mega-bomb') {
            return 'shadow-[0_0_30px_rgba(255,100,0,0.8)] z-20';
        } else if (tile.special) {
            return 'shadow-[0_0_15px_rgba(255,215,0,0.5)] z-10';
        }
        return '';
    };

    const getSpecialOverlay = () => {
        if (tile.special === 'striped-h') {
            return (
                <div className="absolute inset-0 border-[3px] border-white/60 rounded-2xl overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]">
                    <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/90 shadow-[0_0_10px_white] -translate-y-1/2" />
                    <motion.div
                        className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            );
        } else if (tile.special === 'striped-v') {
            return (
                <div className="absolute inset-0 border-[3px] border-white/60 rounded-2xl overflow-hidden shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]">
                    <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_10px_white] -translate-x-1/2" />
                    <motion.div
                        className="absolute left-0 right-0 top-0 h-full bg-gradient-to-b from-transparent via-white/40 to-transparent"
                        animate={{ y: ['-100%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            );

        } else if (tile.special === 'bomb') {
            return (
                <div className="absolute inset-0 border-[3px] border-purple-400/60 rounded-2xl overflow-hidden">
                    <motion.div
                        className="absolute bottom-1 right-1 flex items-center justify-center pointer-events-none"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <BombIcon className="w-8 h-8 drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] opacity-90" />
                    </motion.div>
                </div>
            );
        } else if (tile.special === 'mega-bomb') {
            return (
                <div className="absolute inset-0 border-[4px] border-red-500/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                    <motion.div
                        className="absolute bottom-1 right-1 pointer-events-none z-20"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        <FireIcon className="w-8 h-8 drop-shadow-[0_0_10px_rgba(255,69,0,0.8)] opacity-90" />
                    </motion.div>
                </div>
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
                filter: 'brightness(2)', // Removed blur for performance
                transition: { duration: 0.4, ease: 'circOut' }
            };
        }
        if (tile.special === 'bomb') {
            // Explosion - Toned down
            return {
                scale: 1.2,
                opacity: 0,
                filter: 'brightness(1.5)',
                transition: { duration: 0.3, ease: 'easeOut' }
            };
        }
        if (tile.special === 'striped-h') {
            // Horizontal beam
            return {
                scaleX: 5,
                scaleY: 0.5,
                opacity: 0,
                filter: 'brightness(2)',
                transition: { duration: 0.3, ease: 'easeIn' }
            };
        }
        if (tile.special === 'striped-v') {
            // Vertical beam
            return {
                scaleY: 5,
                scaleX: 0.5,
                opacity: 0,
                filter: 'brightness(2)',
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

    const getCharacterBackground = () => {
        // Unique background gradients for character groups
        const type = tile.type;
        // Group 1: Blues/Cyans
        if (['tralalero', 'brr', 'girafaceleste', 'orcalero'].includes(type))
            return 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20';
        // Group 2: Reds/Pinks
        if (['ballerina', 'bombardilo', 'frulifrula', 'matteooooooooooooo'].includes(type))
            return 'bg-gradient-to-br from-red-500/20 to-pink-600/20';
        // Group 3: Greens
        if (['bombardilo', 'chimpanzini', 'laesok'].includes(type))
            return 'bg-gradient-to-br from-green-500/20 to-emerald-600/20';
        // Group 4: Yellows/Oranges
        if (['tung', 'cappuccino', 'bombombini', 'sigmaboy'].includes(type))
            return 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20';
        // Group 5: Purples
        if (['lirili', 'garamararam', 'trippi'].includes(type))
            return 'bg-gradient-to-br from-purple-500/20 to-indigo-600/20';

        // Default fallback
        return 'bg-white/10';
    };

    return (
        <motion.div
            layout
            layoutId={tile.id}
            initial={{ y: -50, opacity: 0, scale: 0.5 }} // Falling animation
            animate={{
                y: 0,
                scale: 1,
                opacity: 1,
                rotate: 0,
                zIndex: 1,
                filter: isSelected ? 'brightness(1.2)' : 'brightness(1)'
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
                filter: 'brightness(1.1)',
                zIndex: 20
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

                const swipeThreshold = 15;
                const { x, y } = offset;

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
        w-full h-full relative cursor-pointer rounded-2xl 
        flex items-center justify-center touch-none select-none
        ${getSpecialStyle() || getCharacterBackground()}
        ${getSpecialGlow()}
        backdrop-blur-sm
        transition-colors duration-200
        -webkit-tap-highlight-color-transparent
        ${isSelected ? 'md:ring-4 md:ring-yellow-400 md:z-10' : ''}
      `}
        >
            <img
                src={CHARACTER_IMAGES[tile.type]}
                alt={tile.type}
                className="w-[110%] h-[110%] object-contain select-none pointer-events-none drop-shadow-2xl"
            />

            {getSpecialOverlay()}

            {tile.special && (
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                        boxShadow: [
                            '0 0 10px rgba(255,215,0,0.5)',
                            '0 0 20px rgba(255,215,0,0.8)',
                            '0 0 10px rgba(255,215,0,0.5)',
                        ],
                    }}
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
