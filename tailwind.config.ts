import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0d1117',
          surface: '#161c2a',
          card: '#1e2535',
          hover: '#252e42',
        },
        border: {
          DEFAULT: '#2a3347',
          light: '#3a4560',
        },
        nba: {
          orange: '#f4622b',
          red: '#c9082a',
          blue: '#17408b',
        },
        win: '#22c55e',
        loss: '#ef4444',
        muted: '#8c96a8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        glow: '0 0 20px rgba(244,98,43,0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
