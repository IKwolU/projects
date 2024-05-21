/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./@/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {},
        },
      }),
      outline: {
        yellow: "1px solid #fce003",
      },
      colors: {
        red: "#ff4930",
        yellow: "#fce003",
        darkyellow: "#fcd003",
        black: "#0c0a09",
        blix: "#333333",
        gray: "#6D6D6D",
        pale: "#D9D9D9",
        grey: "#e8e7e6",
        white: "#ffffff",
        lightgrey: "#f5f4f2",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        transit: {
          from: "translate-x-full",
          to: "translate-x-0",
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        transit: "transit 0.3s",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
