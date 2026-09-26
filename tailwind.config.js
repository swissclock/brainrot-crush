/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Gelato Arcade: an espresso ground with gelato-flavour accents.
                gelato: {
                    deep: '#140E0C',     // wells: progress track, stat insets
                    bg: '#1B1311',       // page ground
                    surface: '#2A1D19',  // cards and panels
                    raised: '#2E201B',   // buttons, empty board slots
                    tray: '#3A2923',     // board tray, secondary buttons
                    line: '#4A3730',     // unlit stars, dividers
                    cream: '#FFF3E2',    // primary text
                    soft: '#E9D5C0',     // secondary text
                    muted: '#C9B09A',    // labels
                    faint: '#A8917D',    // hints
                    strawberry: '#FF5A87',
                    'strawberry-hi': '#FF86A7',
                    'strawberry-ink': '#2B0714',
                    lemon: '#FFD65A',
                    'lemon-ink': '#2B1A00',
                },
                // Tile flavours. They also differ in lightness, not just hue.
                scoop: {
                    blueberry: '#9FD3E8',
                    hazelnut: '#E8C79A',
                    strawberry: '#F5B5C8',
                    pistachio: '#B9DC8E',
                    lavender: '#C9B6E8',
                    lemon: '#F2DE8A',
                },
            },
            fontFamily: {
                display: ['"Bagel Fat One"', 'system-ui', 'sans-serif'],
                sans: ['Nunito', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                // Static bevels only: no filters, nothing animated.
                bevel: 'inset 0 -4px 0 rgba(0,0,0,0.3)',
                'bevel-lg': 'inset 0 -6px 0 rgba(0,0,0,0.35), 0 20px 60px rgba(0,0,0,0.5)',
                tile: 'inset 0 -4px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.55)',
                button: 'inset 0 -5px 0 rgba(0,0,0,0.22), inset 0 3px 0 rgba(255,255,255,0.3)',
            },
        },
    },
    plugins: [],
}
