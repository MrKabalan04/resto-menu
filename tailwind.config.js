/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                lava: {
                    light: '#EF233C',
                    DEFAULT: '#D90429', // Primary
                    dark: '#8D0618',
                },
                dark: {
                    bg: '#0F0F0F',
                    card: '#1A1A1A',
                    text: '#F5F5F5',
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
