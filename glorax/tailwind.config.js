const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./@/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brown: "#8E6D4F",
        blue: "#3200F0",
        lightblue: "#F2F8FE",
        lightbrown: "#E9E4DC",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mont: ["Montserrat", "sans-serif"],
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
        showG: {
          "0%, 60%": { opacity: "0" },
          "60%,  95%": { opacity: "1" },
          "95%, 100%": { opacity: "0" },
        },
        showL: {
          "0%, 55%": { opacity: "0" },
          "55%,  90%": { opacity: "1" },
          "90%, 100%": { opacity: "0" },
        },
        showO: {
          "0%, 50%": { opacity: "0" },
          "50%,  85%": { opacity: "1" },
          "85%, 100%": { opacity: "0" },
        },
        showR: {
          "0%, 45%": { opacity: "0" },
          "45%,  80%": { opacity: "1" },
          "80%, 100%": { opacity: "0" },
        },
        showA: {
          "0%, 40%": { opacity: "0" },
          "40%, 75%": { opacity: "1" },
          "75%, 100%": { opacity: "0" },
        },
        showX: {
          "0%, 35%": { opacity: "0" },
          "35%, 70%": { opacity: "1" },
          "70%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
