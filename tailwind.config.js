/** @type {import('tailwindcss').Config} */
// Tokens shared with the survey sheets of rishabhramteke.github.io (assets/css/sheet.css)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EDEFEC',
        paper2: '#E2E5E1',
        wine: '#8A2A3D',
        winedeep: '#5B1426',
        ink: '#231518',
        ink2: '#5A4549',
        rule: '#3A1D24',
        rulesoft: 'rgba(58, 29, 36, 0.28)',
      },
      fontFamily: {
        sans: ['Barlow', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Barlow', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s cubic-bezier(.16,1,.3,1) both',
        'slide-in': 'slide-in 0.45s cubic-bezier(.16,1,.3,1) both',
      },
    },
  },
  plugins: [],
};
