/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-brown': '#310d00',
        'custom-lightBrown': '#5a3d33',
        'custom-skin': '#f3d7c7',
        'custom-lightSkin': '#fbf3ee'
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

