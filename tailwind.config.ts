import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        darkGray: '#4B4B4B', // Custom dark grey color
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        typing: {
          from: { width: '0%' },
          to: { width: '22ch' },
        },
        blinkCaret: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s linear infinite',
        typing: 'typing 2s steps(30, end) forwards, blinkCaret .75s step-end infinite',
      },
    },
  },
  plugins: [],
}

export default config
