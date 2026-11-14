/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        }
      },
      fontFamily: {
        bengali: ['"Noto Sans Bengali"', '"Anek Bangla"', '"SolaimanLipi"', '"Kalpurush"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        islamic: {
          "primary": "#065f46",       // Emerald Green
          "secondary": "#ca8a04",     // Warm Gold
          "accent": "#047857",        // Rich Green Accent
          "neutral": "#1f2937",       // Charcoal/Dark Slate
          "base-100": "#ffffff",      // Pure White
          "base-200": "#f8fafc",      // Soft Gray/Light Background
          "base-300": "#f1f5f9",      // Slightly darker border/bg
          "info": "#0284c7",
          "success": "#16a34a",
          "warning": "#eab308",
          "error": "#dc2626",
        },
      },
      "light",
    ],
  },
}
