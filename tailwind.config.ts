
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: 'bg-black',
        foreground: 'text-zinc-100',
        card: 'bg-zinc-900',
        'card-foreground': 'text-zinc-100',
        popover: 'bg-zinc-900',
        'popover-foreground': 'text-zinc-100',
        primary: 'bg-zinc-900',
        'primary-foreground': 'text-zinc-100',
        secondary: 'bg-zinc-800',
        'secondary-foreground': 'text-zinc-100',
        muted: 'bg-zinc-800',
        'muted-foreground': 'text-zinc-400',
        accent: 'bg-zinc-800',
        'accent-foreground': 'text-zinc-100',
        destructive: 'bg-red-600',
        'destructive-foreground': 'text-zinc-100',
        border: 'border-zinc-800',
        input: 'border-zinc-700',
        ring: 'ring-zinc-800',
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
