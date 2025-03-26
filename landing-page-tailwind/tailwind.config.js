/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#111111',
          surface: '#1a1a1a',
          border: 'rgba(255, 255, 255, 0.1)'
        },
        accent: {
          blue: '#3a86ff',
          'blue-hover': '#2a75f5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'glass': '0 4px 12px rgba(0, 0, 0, 0.2)',
        'glass-hover': '0 8px 20px rgba(0, 0, 0, 0.3)'
      },
      backdropBlur: {
        'glass': '10px'
      }
    },
  },
  plugins: [],
}
