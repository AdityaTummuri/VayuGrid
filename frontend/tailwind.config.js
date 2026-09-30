/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#090D16',       // Deep mission control slate base
          panel: '#0F172A',    // Structured container/sidebar
          surface: '#151F32',  // Table row / card surface
          elevated: '#1E293B', // High-contrast popovers / headers
          hover: '#1E2A3E',    // Interactive hover state
        },
        border: {
          subtle: '#1E293B',
          strong: '#334155',
          active: '#38BDF8',
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
        'panel': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
