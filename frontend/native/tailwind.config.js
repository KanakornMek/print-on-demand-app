/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // colors: {
      //   primary: '#1E3A8A',
      //   secondary: '#FBBF24',
      //   accent: '#F472B6',
      // },
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      //   serif: ['Merriweather', 'serif'],
      //   mono: ['Fira Code', 'monospace'],
      // },
    },
  },
  plugins: [],
};
