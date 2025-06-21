/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // For your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // For all JS/TS/JSX/TSX files in src and its subdirectories
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}