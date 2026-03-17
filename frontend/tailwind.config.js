/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        peach: '#FFE5D4',
        beige: '#F6F1EB',
        sage: '#8FBF9F',
        brown: '#6B4F3A',
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(107, 79, 58, 0.08)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(107, 79, 58, 0.04)',
      }
    },
  },
  plugins: [],
}
