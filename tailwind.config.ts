/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f7',
          100: '#d8f1ed',
          200: '#b1e3da',
          300: '#7fcfc3',
          400: '#52b5a5',
          500: '#359b8b',
          600: '#25ad7b',
          700: '#1e8265',
          800: '#1a6852',
          900: '#175344',
        },
        secondary: {
          50: '#f0f7fc',
          100: '#def1f8',
          200: '#b8e1f0',
          300: '#7fcde6',
          400: '#52b5d9',
          500: '#329ccf',
          600: '#2eafec',
          700: '#1e87d0',
          800: '#1a68a8',
          900: '#175387',
        },
        dark: {
          bg: '#0a0e27',
          card: '#1a1f3a',
          text: '#e0e0e0',
        },
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Raleway"', 'sans-serif'],
        accent: ['"Poppins"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      spacing: {
        section: '5rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
