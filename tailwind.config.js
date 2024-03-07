/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      margin: {
        '-2px': '-2px',
        '-4px': '-4px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
