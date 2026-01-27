/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          900: '#050505',
          800: '#0A0A0F',
          700: '#151520',
        },
        chrome: {
          100: '#ffffff',
          300: '#E0E0E0',
          500: '#A0A0A0',
          700: '#505050',
        },
        neon: {
          purple: '#b000ff',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        wide: '0.05em',
      },
    },
  },
  plugins: [],
}
