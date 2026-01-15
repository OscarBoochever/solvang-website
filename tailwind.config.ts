import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Navy (trust, government)
        navy: {
          900: '#0f2744',
          800: '#162d4d',
          700: '#1e3a5f',
          600: '#2a4a73',
          500: '#2d5a87',
          400: '#4a7ba7',
          300: '#7da3c7',
          200: '#b3cde3',
          100: '#e8f1f8',
          50: '#f4f8fc',
        },
        // Accent - Danish Gold
        gold: {
          600: '#b8860b',
          500: '#d69e2e',
          400: '#eab308',
          300: '#facc15',
          200: '#fde047',
          100: '#fef9e7',
          50: '#fefce8',
        },
        // Secondary - Burgundy
        burgundy: {
          700: '#7f1d1d',
          600: '#9b2c2c',
          500: '#c53030',
          400: '#e53e3e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
