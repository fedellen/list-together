module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    // colors: {
    //   // // Purple Theme
    //   // lighter: '#95bdc4',
    //   // light: '#313457',
    //   // medium: '#120a1a',
    //   // dark: '#120a1a',
    //   // darker: '#07020a'
    //   // lighter: '#d8d8f6', // Lavender Web
    //   // light: '#B18FCF', // African Violet
    //   // medium: '#978897', // Hellotrope Gray
    //   // dark: '#494850', // Dark liver
    //   // darker: '#2C2C34' // Raisen Black
    // },
    extend: {
      fontFamily: {
        body: ['Roboto'],
        heading: ['Lora']
      },
      colors: {
        ppjsOrange: '#f57f26',
        ppjsBlue: '#27A0F2'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
