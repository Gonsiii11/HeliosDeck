/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0c1018',
        nebula: '#f5efe6',
        aurora: '#2dd4bf',
        flare: '#ff6b4a',
        magneto: '#1e2538',
        sand: '#f2c94c',
        sky: '#5ab0ff',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Eurostile"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(45, 212, 191, 0.25)',
      },
      backgroundImage: {
        'starlight': 'radial-gradient(circle at 10% 20%, rgba(45, 212, 191, 0.22), transparent 38%), radial-gradient(circle at 85% 5%, rgba(255, 107, 74, 0.2), transparent 42%), linear-gradient(145deg, rgba(8, 12, 18, 0.96), rgba(15, 20, 34, 0.98))',
      },
    },
  },
  plugins: [],
}
