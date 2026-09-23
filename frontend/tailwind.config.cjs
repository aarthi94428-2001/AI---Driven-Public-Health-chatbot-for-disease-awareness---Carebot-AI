module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'care-navy': '#0B132B',
        'care-blue': '#3FD0FF',
        'care-purple': '#7B61FF',
        'care-pink': '#FF7EDB',
        'care-text': '#EAEAEA',
        'care-gray': '#A0AEC0',
      },
      boxShadow: {
        'soft-blue': '0 0 10px rgba(63, 208, 255, 0.2), 0 0 20px rgba(63, 208, 255, 0.1)',
        'soft-purple': '0 0 10px rgba(123, 97, 255, 0.2), 0 0 20px rgba(123, 97, 255, 0.1)',
        'soft-pink': '0 0 10px rgba(255, 126, 219, 0.2), 0 0 20px rgba(255, 126, 219, 0.1)',
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 0.8, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}