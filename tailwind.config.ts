/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A0E1A',
          surface: '#111827',
          elevated: '#1a2235',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C97A',
          dim: '#8B7235',
        },
        'indigo-chart': '#6366F1',
        'indigo-light': '#818CF8',
        'text-primary': '#F5F0E8',
        'text-muted': '#8A9BB8',
        'text-faint': '#4A5568',
        success: '#22C55E',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)',
        'glow-gold': '0 0 20px rgba(201,168,76,0.2)',
        'glow-indigo': '0 0 20px rgba(99,102,241,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
