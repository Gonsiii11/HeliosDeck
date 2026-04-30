/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d1117',
        nebula: '#f5f7ff',
        aurora: '#58f2c7',
        flare: '#ff9f1c',
        magneto: '#2a2f4a',
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Eurostile"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(88, 242, 199, 0.2)',
      },
      backgroundImage: {
        'starlight': 'radial-gradient(circle at 12% 20%, rgba(88, 242, 199, 0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(255, 159, 28, 0.18), transparent 45%), linear-gradient(135deg, rgba(10, 12, 18, 0.96), rgba(18, 21, 33, 0.98))',
      },
    },
  },
  plugins: [],
}
