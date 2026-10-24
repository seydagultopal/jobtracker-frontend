/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#F8F4ED',
        columbia: '#B7A0F6',
        cherry: '#FF806B',
        cambridge: '#9CAF91',
        peach: '#FFB39A',
        night: '#15101F',
        twilight: '#21182F',
        starlight: '#40304F'
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
