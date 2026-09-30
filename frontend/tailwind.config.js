/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#F1F5F9',       // Clean, professional GovTech slate-100 canvas
          panel: '#FFFFFF',    // Crisp white structured container
          surface: '#F8FAFC',  // Subtle slate-50 card / table surface
          elevated: '#FFFFFF', // High-contrast popovers & modal cards
          hover: '#F1F5F9',    // Hover state
        },
        border: {
          subtle: '#E2E8F0',   // Hairline Slate-200 border
          strong: '#CBD5E1',   // Slate-300 border
          active: '#2563EB',   // Civic Blue
        },
        civic: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: 'rgba(37, 99, 235, 0.12)',
        },
        cpcb: {
          good: '#16A34A',
          satisfactory: '#65A30D',
          moderate: '#D97706',
          poor: '#EA580C',
          veryPoor: '#DC2626',
          severe: '#7F1D1D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0 10px 20px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
      },
    },
  },
  plugins: [],
};
