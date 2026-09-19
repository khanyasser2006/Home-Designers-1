/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      script: ['"Pinyon Script"', 'cursive'],
      display: ['"Bodoni Moda"', 'Georgia', 'serif'],
      serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        mocha: {
          DEFAULT: '#4E342E',
          deep: '#3E2723',
          mid: '#5D4037',
          light: '#6D4C41',
        },
        latte: {
          DEFAULT: '#D7CCC8',
          warm: '#EFEBE9',
          cream: '#F5F0ED',
          deep: '#BCAAA4',
        },
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
      },
      letterSpacing: {
        display: '-0.03em',
        tight: '-0.02em',
        wide: '0.12em',
        ultra: '0.25em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      borderRadius: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
      },
    },
  },
  plugins: [],
};
