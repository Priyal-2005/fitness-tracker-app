/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0e0f11', card: '#1a1b1e', card2: '#1e2023',
          border: '#2a2c30', text: '#e8e9eb', muted: '#6b6f78', secondary: '#8a8f99',
        },
      },
    },
  },
  plugins: [],
}
