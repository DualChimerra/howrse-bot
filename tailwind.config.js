/******** TailwindCSS config for renderer ********/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/**/*.{ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#2f3136',
        card: '#3a3d42',
        text: '#e4e6eb',
        accent: '#7c3aed'
      },
      borderRadius: {
        xl: '16px'
      }
    },
  },
  plugins: [],
}