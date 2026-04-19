import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#EEEEFF",
          100: "#DDDCFF",
          200: "#C2C1FD",
          300: "#A6A4FA",
          400: "#8B89F6",
          500: "#7472F2",
          600: "#6060EE",
          700: "#4B4CD4",
          800: "#3A3BB5",
          900: "#2A2B95",
          950: "#5D5FEF",
        },
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body:    ["var(--font-inter)",   "sans-serif"],
      },
      animation: {
        "float":          "float 7s ease-in-out infinite",
        "float-delayed":  "float 7s ease-in-out 2.5s infinite",
        "float-slow":     "float 9s ease-in-out 1s infinite",
        "fade-in":        "fadeIn 0.6s ease-out",
        "slide-up":       "slideUp 0.5s ease-out",
        "slide-up-delay": "slideUp 0.5s ease-out 0.1s both",
        "spin-slow":      "spin 8s linear infinite",
        "pulse-soft":     "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":       { transform: "translateY(-18px) rotate(2deg)" },
          "66%":       { transform: "translateY(-8px) rotate(-1deg)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":       { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
      backgroundImage: {
        "grid-white": "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
      },
      boxShadow: {
        "brand": "0 10px 40px -10px rgba(93,95,239,0.35)",
        "card":  "0 4px 24px -4px rgba(0,0,0,0.08), 0 1px 6px -1px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
