/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maritime: {
          dark: "#0a192f",
          blue: "#112240",
          light: "#233554",
          accent: "#64ffda",
          gray: "#8892b0",
        },
        status: {
          normal: "#4ade80",
          off: "#f87171",
          warning: "#fbbf24",
          repair: "#60a5fa",
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
