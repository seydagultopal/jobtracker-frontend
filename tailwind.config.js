/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Dark mode özelliğini aktif ettik
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
        // Tatlı ve soft Dark Mode renklerimiz:
        night: '#252432',     // Ana arka plan (Gece)
        twilight: '#2F2E3E',  // Kartlar ve Modallar (Alacakaranlık)
        starlight: '#4A495C'  // Çizgiler ve Hover efektleri (Yıldız Işığı)
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}