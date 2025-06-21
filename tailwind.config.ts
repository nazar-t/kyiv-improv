import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#1a1a1a', // Deep black for background
        'accent-yellow': '#FFD700', // Gold/bright yellow for accents
        'text-light': '#f0f0f0', // Light text on dark background
        'text-dark': '#333333', // Dark text on light background (for form inputs)
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'monospace'], // Machine-typing font
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Custom utilities for abstract shapes (example)
      // You can expand on these with more complex SVGs or pseudo-elements
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
