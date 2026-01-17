import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Arial', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 60px -30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}

export default config
