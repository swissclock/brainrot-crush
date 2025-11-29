export type TileType =
    | 'tralalero' | 'tung' | 'ballerina' | 'brr' | 'bombardilo' | 'cappuccino'
    | 'lirili' | 'garamararam' | 'tralaleritos' | 'chicleteira' | 'trippi' | 'chimpanzini'
    | 'ballerinolololo' | 'bobrito' | 'bombombini' | 'boneca' | 'briibrii' | 'burbaloni'
    | 'chaimaestro' | 'cocofanto' | 'espressona' | 'frigocamelo' | 'frulifrula' | 'girafaceleste'
    | 'laesok' | 'matteo' | 'orangutini' | 'orcalero' | 'rhinotoasterino'
    | 'sigmaboy' | 'tobtobi' | 'tracotucotulu' | 'zibrazubra';

export type SpecialType = 'striped-h' | 'striped-v' | 'bomb' | 'mega-bomb' | null;

export interface Tile {
    id: string;
    type: TileType;
    special: SpecialType;
}

export type Grid = (Tile | null)[][];

export interface Level {
    number: number;
    targetScore: number;
    moves: number;
    characters: TileType[];
}

export const BOARD_SIZE = 8;

// All available characters in order of introduction
const ALL_CHARACTERS: TileType[] = [
    'tralalero', 'tung', 'ballerina', 'brr', 'bombardilo', 'cappuccino',
    'lirili', 'garamararam', 'tralaleritos', 'chicleteira', 'trippi', 'chimpanzini',
    'ballerinolololo', 'bobrito', 'bombombini', 'boneca', 'briibrii', 'burbaloni',
    'chaimaestro', 'cocofanto', 'espressona', 'frigocamelo', 'frulifrula', 'girafaceleste',
    'laesok', 'matteo', 'orangutini', 'orcalero', 'rhinotoasterino',
    'sigmaboy', 'tobtobi', 'tracotucotulu', 'zibrazubra'
];

// Generate 100 levels with progressive difficulty
const generateLevels = (): Level[] => {
    const levels: Level[] = [];

    for (let i = 1; i <= 100; i++) {
        // Start with 4 characters (minimum needed to avoid initial matches and infinite loops),
        // add 1 per level up to 6, then keep rotating
        const numCharacters = Math.min(Math.max(4, i + 3), 6);

        // Get characters for this level (cycling through all available)
        const characters: TileType[] = [];
        for (let j = 0; j < numCharacters; j++) {
            const charIndex = (i - 1 + j) % ALL_CHARACTERS.length;
            characters.push(ALL_CHARACTERS[charIndex]);
        }

        // Progressive difficulty scaling
        const baseScore = 200;
        const scoreMultiplier = Math.pow(1.08, i - 1); // Reduced from 15% to 8% increase per level
        const targetScore = Math.floor(baseScore * scoreMultiplier);

        // Moves INCREASE gradually to help with harder levels
        const baseMoves = 25; // Increased base moves from 20 to 25
        const moveIncrease = Math.floor((i - 1) / 1.5); // Add 1 move every 1.5 levels (faster increase)
        const moves = Math.min(60, baseMoves + moveIncrease); // Cap at 60 moves

        levels.push({
            number: i,
            targetScore,
            moves,
            characters
        });
    }

    return levels;
};

export const LEVELS: Level[] = generateLevels();

// Character display names
export const CHARACTER_NAMES: Record<TileType, string> = {
    tralalero: 'Tralalero Tralala',
    tung: 'Tung Tung Sahur',
    ballerina: 'Ballerina Cappuccina',
    brr: 'Brr Brr Patapim',
    bombardilo: 'Bombardilo Crocodilo',
    cappuccino: 'Cappuccino Assassino',
    lirili: 'Lirili Larila',
    garamararam: 'Garamararam',
    tralaleritos: 'Los Tralaleritos',
    chicleteira: 'Chicleteira Bicicleteira',
    trippi: 'Trippi Troppi',
    chimpanzini: 'Chimpanzini Bananini',
    ballerinolololo: 'Ballerino Lololo',
    bobrito: 'Bobrito Bandito',
    bombombini: 'Bombombini Gusini',
    boneca: 'Boneca Ambalabu',
    briibrii: 'Bri Bri Bicus Dicus',
    burbaloni: 'Burbaloni Luliloli',
    chaimaestro: 'Chai Maestro',
    cocofanto: 'Cocofanto Elefanto',
    espressona: 'Espressona Signora',
    frigocamelo: 'Frigo Camelo',
    frulifrula: 'Frulli Frulla',
    girafaceleste: 'Giraffa Celeste',
    laesok: 'La Esok Sikola',
    matteo: 'Matteooooo',
    orangutini: 'Orangutini Ananasini',
    orcalero: 'Orcalero Orcala',
    rhinotoasterino: 'Rhino Toasterino',
    sigmaboy: 'Sigma Boy',
    tobtobi: 'Tob Tobi Tob Tob',
    tracotucotulu: 'Tracotucotulu Delapeladustuz',
    zibrazubra: 'Zibra Zubra Zibralini',
};

// Emoji representations
export const CHARACTER_EMOJI: Record<TileType, string> = {
    tralalero: '🎵',
    tung: '🥁',
    ballerina: '💃',
    brr: '🥶',
    bombardilo: '🐊',
    cappuccino: '☕',
    lirili: '🎶',
    garamararam: '🎸',
    tralaleritos: '🎺',
    chicleteira: '🚲',
    trippi: '🎪',
    chimpanzini: '🍌',
    ballerinolololo: '🩰',
    bobrito: '🤠',
    bombombini: '🐝',
    boneca: '🎎',
    briibrii: '🎲',
    burbaloni: '🎈',
    chaimaestro: '🍵',
    cocofanto: '🐘',
    espressona: '☕',
    frigocamelo: '🐫',
    frulifrula: '🍓',
    girafaceleste: '🦒',
    laesok: '🏫',
    matteo: '👨',
    orangutini: '🦧',
    orcalero: '🐋',
    rhinotoasterino: '🦏',
    sigmaboy: '💪',
    tobtobi: '🎯',
    tracotucotulu: '🚜',
    zibrazubra: '🦓',
};
