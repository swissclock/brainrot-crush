/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brainrot: {
                    purple: '#6d28d9', // Grimace
                    gold: '#fbbf24', // Sigma
                    red: '#ef4444', // Ohio
                    green: '#22c55e', // Fanum
                }
            },
            animation: {
                'bounce-short': 'bounce 0.5s infinite',
            }
        },
    },
    plugins: [],
}
