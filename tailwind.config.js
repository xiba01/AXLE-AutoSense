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
          900: '#050505', // The Void (Background)
          800: '#0A0A0F', // Deep Charcoal (Surface)
          700: '#151520', // Lighter Surface
        },
        chrome: {
          100: '#ffffff', // Highlight
          300: '#E0E0E0', // Light Silver
          500: '#A0A0A0', // Mid Metal
          700: '#505050', // Dark Metal
        },
        neon: {
          purple: '#b000ff', // Subtle accent
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
