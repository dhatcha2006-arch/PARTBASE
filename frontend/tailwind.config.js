/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0B0B0C',
        surface: {
          DEFAULT: '#161618',
          dark: '#0F0F10',
          elevated: '#1A1A1D',
          hover: '#222226'
        },
        lime: {
          DEFAULT: '#C6F432',
          glow: 'rgba(198, 244, 50, 0.35)',
          muted: 'rgba(198, 244, 50, 0.15)',
          dark: '#A4D120',
          darker: '#75990D'
        },
        muted: {
          DEFAULT: '#A1A1AA',
          light: '#B4B4BC',
          dark: '#71717A'
        },
        borderSubtle: 'rgba(255, 255, 255, 0.1)',
        borderLime: 'rgba(198, 244, 50, 0.3)'
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'serif', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'panel': '20px',
      },
      boxShadow: {
        'lime-glow': '0 0 25px rgba(198, 244, 50, 0.35), 0 0 50px rgba(198, 244, 50, 0.15)',
        'lime-glow-lg': '0 0 45px rgba(198, 244, 50, 0.45), 0 0 80px rgba(198, 244, 50, 0.2)',
        'panel': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'panel-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(198, 244, 50, 0.25)',
      },
      letterSpacing: {
        'badge': '1.2px',
      }
    },
  },
  plugins: [],
}
