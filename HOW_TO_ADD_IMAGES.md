# How to Add Custom Character Images

The game currently uses emoji placeholders. Here's how to replace them with actual images:

## Option 1: Quick Replace (Recommended)

1. **Download/Save character images** to `src/assets/` folder with these exact names:
   - `tralalero.png` - Tralalero Tralala
   - `tung.png` - Tung Tung Sahur
   - `ballerina.png` - Ballerina Cappuccina
   - `brr.png` - Brr Brr Patapim
   - `bombardilo.png` - Bombardilo Crocodilo
   - `cappuccino.png` - Cappuccino Assassino
   - `lirili.png` - Lirili Larila
   - `garamararam.png` - Garamararam
   - `tralaleritos.png` - Los Tralaleritos
   - `chicleteira.png` - Chicleteira Bicicleteira
   - `trippi.png` - Trippi Troppi
   - `chimpanzini.png` - Chimpanzini Bananini

2. **Update Tile.tsx** to use images instead of emojis:

Replace the emoji section in `src/components/Tile.tsx`:

```tsx
// At the top, add imports:
import tralalero from '../assets/tralalero.png';
import tung from '../assets/tung.png';
import ballerina from '../assets/ballerina.png';
import brr from '../assets/brr.png';
import bombardilo from '../assets/bombardilo.png';
import cappuccino from '../assets/cappuccino.png';
import lirili from '../assets/lirili.png';
import garamararam from '../assets/garamararam.png';
import tralaleritos from '../assets/tralaleritos.png';
import chicleteira from '../assets/chicleteira.png';
import trippi from '../assets/trippi.png';
import chimpanzini from '../assets/chimpanzini.png';

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
};

// Then replace the emoji div with:
<img 
  src={CHARACTER_IMAGES[tile.type]} 
  alt={tile.type}
  className="w-[80%] h-[80%] object-contain select-none pointer-events-none drop-shadow-lg"
/>
```

## Option 2: Use URLs

If you have image URLs, you can update `src/types.ts`:

```typescript
export const CHARACTER_IMAGES: Record<TileType, string> = {
  tralalero: 'https://example.com/tralalero.png',
  tung: 'https://example.com/tung.png',
  // ... etc
};
```

Then in Tile.tsx:
```tsx
import { CHARACTER_IMAGES } from '../types';

// In the component:
<img 
  src={CHARACTER_IMAGES[tile.type]} 
  alt={tile.type}
  className="w-[80%] h-[80%] object-contain select-none pointer-events-none drop-shadow-lg"
/>
```

## Finding Images

Since the wikis are hard to scrape, you can:
1. **Manually screenshot** characters from the wiki page you have open
2. **Use Google Images** search for each character name
3. **Create simple icons** using any image editor
4. **Use AI image generators** with the character names

The game will work great with any 128x128+ PNG images!
