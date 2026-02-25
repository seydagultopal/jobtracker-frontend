/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#EEEFE8',
        columbia: '#C5D7E8', 
        cherry: '#E9ACBB',
        cambridge: '#8FBC93',
        peach: '#FCEBBF',
      },
      fontFamily: {
        // iPhone ve Mac'teki varsayılan estetik fontları ilk sıraya alıyoruz
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}