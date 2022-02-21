const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: '520px',
      },
      boxShadow: {
        commentMenu: '0 2px 5px 0 rgba(0, 0, 0, .1)',
      },
      height: {
        fit: 'fit-content',
      },
      minHeight: {
        1: '100px',
      },
    },
  },
  variants: {
    extend: {},
    borderColor: ({ after }) => after(['invalid']),
    opacity: ({ after }) => after(['disabled']),
    cursor: ({ after }) => after(['disabled']),
  },
  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant('invalid', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) => `.${e(`invalid${separator}${className}`)}:invalid`
        );
      });
    }),
  ],
};
