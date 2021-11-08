const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
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
