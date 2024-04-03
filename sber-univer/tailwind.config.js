/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [ 
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    prefix: "",
    theme: { 
      extend: {
        typography: (theme) => ({
          DEFAULT: {
            css: {
            },
          },
        }), 
      },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
  };