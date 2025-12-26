/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#25d466",
        "background-light": "#f6f8f7",
        "background-dark": "#122017",
      },
      boxShadow: {
        'glow': '0 0 20px rgba(37, 212, 102, 0.4)',
      }
    },
  },
  plugins: [],
}