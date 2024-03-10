/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      margin: {
        '-2px': '-2px',
        '-4px': '-4px',
      },
      spacing: {
        'single-line-height': 'var(--spectrum-alias-single-line-height)',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
