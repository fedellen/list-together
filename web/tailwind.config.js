module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '460px',
      md: '670px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '0.75rem',
        sm: '1.25rem',
        md: '4rem',
        lg: '7rem',
        xl: '9rem',
        '2xl': '12rem'
      }
    },
    extend: {
      fontSize: {
        xxs: '.65rem'
      },
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
