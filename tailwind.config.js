/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bakery: {
                    light: '#dca67d', // soft terracotta
                    DEFAULT: '#c48b64', // dusty orange / copper
                    dark: '#935d39',    // warm brown
                },
                dark: {
                    bg: '#1A1209',        // Deep warm charcoal
                    card: '#2A1F12',      // Warm dark brown
                    text: '#FFF8F0',      // Warm white
                }
            },
            fontFamily: {
                en: ['Outfit', 'sans-serif'],
                ar: ['Cairo', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
