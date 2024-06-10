/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class'],
  content: [
    "./node_modules/flowbite/**/*.js",
    "./resources/**/*.blade.php",
    "./resources/**/**/*.vue",
    "./resources/**/**/**/*.vue",
    "./resources/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        c_orange: '#F59502',
        c_black: '#000205',
        c_gray: '#1E1B1D'
      },
      fontFamily: {
        'Rubik': ['Rubik'],
      },
    },
    screens: {
      '2xl': { max: "1368px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "769px" },
      sm: { max: "639px" },
    }
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwindcss-textshadow')
  ]
}

