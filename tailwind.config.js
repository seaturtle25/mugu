/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'custom-brown': '#310d00',
        'custom-skin': '#f3d7c7',
        'custom-lightSkin': '#f7f0e6'
      },
      fontFamily: {
        titleFont: ['MarukoTC-Medium'],
        contentFont: ['MarukoTC-Regular']
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}

