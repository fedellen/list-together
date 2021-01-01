module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      lighter: '#d8d8f6', // Lavender Web
      light: '#B18FCF', // African Violet
      medium: '#978897', // Hellotrope Gray
      dark: '#494850', // Dark liver
      darker: '#2C2C34' // Raisen Black
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
