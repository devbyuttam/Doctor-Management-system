/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Teal
    'bg-teal-50', 'bg-teal-100', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700',
    'text-teal-200', 'text-teal-300', 'text-teal-400', 'text-teal-500', 'text-teal-600', 'text-teal-700',
    'border-teal-100', 'border-teal-200', 'border-teal-300', 'border-teal-400', 'border-teal-500',
    'hover:bg-teal-50', 'hover:bg-teal-100', 'hover:border-teal-300', 'hover:border-teal-400',
    'from-teal-500', 'from-teal-600', 'to-teal-600', 'to-teal-700', 'via-teal-600',
    'shadow-teal-200', 'shadow-teal-500/30',
    // Emerald
    'bg-emerald-50', 'bg-emerald-500', 'bg-emerald-600',
    'text-emerald-300', 'text-emerald-400', 'text-emerald-600',
    'border-emerald-200',
    'from-emerald-500', 'from-emerald-600', 'to-emerald-600',
    // Indigo
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-600', 'bg-indigo-700',
    'text-indigo-200', 'text-indigo-300', 'text-indigo-600', 'text-indigo-700',
    'border-indigo-100', 'border-indigo-200', 'border-indigo-300', 'border-indigo-400', 'border-indigo-500',
    'hover:bg-indigo-50', 'hover:border-indigo-300', 'hover:border-indigo-400',
    'from-indigo-600', 'to-indigo-600', 'to-indigo-700', 'via-indigo-600',
    'shadow-indigo-200', 'shadow-indigo-500/30',
    // Violet / Purple
    'bg-violet-50', 'bg-violet-100', 'bg-violet-600',
    'text-violet-200', 'text-violet-300', 'text-violet-500', 'text-violet-600', 'text-violet-700',
    'border-violet-100', 'border-violet-200', 'border-violet-300',
    'hover:bg-violet-50', 'hover:border-violet-300',
    'from-violet-600', 'to-violet-600', 'via-purple-600',
    'shadow-violet-500/30',
    // Amber
    'bg-amber-50', 'text-amber-300', 'text-amber-400', 'text-amber-600', 'bg-amber-500', 'bg-amber-600',
    'border-amber-200', 'border-amber-300',
    // Dots
    'bg-teal-400', 'bg-indigo-400', 'bg-violet-400', 'bg-amber-400',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      boxShadow: {
        'teal': '0 4px 24px -4px rgba(20, 184, 166, 0.3)',
        'indigo': '0 4px 24px -4px rgba(99, 102, 241, 0.3)',
      },
    },
  },
  plugins: [],
}
