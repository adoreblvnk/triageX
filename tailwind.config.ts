import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#000',
        foreground: 'hsl(240 5.9% 90%)', // zinc-100
        border: 'hsl(240 3.7% 15.9%)', // zinc-800
        accent: {
          DEFAULT: 'hsl(0 72.2% 50.6%)', // red-600
          foreground: 'hsl(240 5.9% 90%)',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-fira-code)', ...defaultTheme.fontFamily.mono],
      },
      borderColor: {
        DEFAULT: 'hsl(240 3.7% 15.9%)',
      },
    },
  },
  plugins: [],
}
export default config