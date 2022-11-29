module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: '#fff',
      black: '#000',
      transparent: 'transparent',
      merlot: '#460223',
      parchment: '#F7F5E7',
      periwinkle: '#6944FF',
      coral: '#FF4E00'
    },
    fontFamily: {
      'primary': ['Bradford LL', 'serif'],
      'secondary': ['Bradford Mono LL', 'monospace'],
    },
    fontSize: {
      'level-1': ['10rem', '1.1'],
      'level-1-mobile': ['4.6rem', '1.21'],
      'level-2': ['4.6rem', '1.17'],
      'level-2-mobile': ['3rem', '1.26'],
      'level-3': ['3rem', '1.26'],
      'level-3-mobile': ['1.8rem', '2'],
      'level-body': ['1.6rem', '1.36'],
      'level-body-mobile': ['1.3rem', '1.46'],
      'level-subhead': ['1.6rem', '1.25'],
      'level-subhead-mobile': ['1.3rem', '1.3'],
    },
    flex: {
      '0-0': '0 0 auto',
    },
    extend: {
      spacing: {
        'def': '2rem',
        'def-mobile': '1rem',
      },
    },
  },
  plugins: [],
}
