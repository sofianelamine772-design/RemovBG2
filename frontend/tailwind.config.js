/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#fdfcfe',
          primary: '#7c3aed', // violet-600
          secondary: '#d946ef', // fuchsia-500
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)',
      }
    },
  },
  plugins: [],
}
