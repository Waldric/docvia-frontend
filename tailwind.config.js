/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#89ADE2',
          dark: '#6B93D1',
          light: '#A5C2EB',
        },
        background: '#F5F5F5',
        card: '#FFFFFF',
        text: {
          primary: '#000000',
          secondary: '#666666',
          muted: '#999999',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}