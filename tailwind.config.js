/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-container-lowest': '#0e0e0e',
        'surface': '#131313',
        'on-tertiary-fixed': '#002107',
        'surface-dim': '#131313',
        'on-tertiary-fixed-variant': '#00531c',
        'error-container': '#93000a',
        'on-tertiary-container': '#00320e',
        'on-background': '#e5e2e1',
        'on-secondary-fixed': '#410001',
        'on-primary': '#002e69',
        'inverse-on-surface': '#313030',
        'on-primary-fixed': '#001a41',
        'tertiary-fixed': '#72fe88',
        'surface-container': '#201f1f',
        'surface-bright': '#3a3939',
        'on-primary-container': '#00285c',
        'inverse-primary': '#005bc1',
        'on-primary-fixed-variant': '#004493',
        'on-error': '#690005',
        'on-secondary-fixed-variant': '#930005',
        'surface-container-low': '#1c1b1b',
        'surface-tint': '#adc6ff',
        'on-surface': '#e5e2e1',
        'surface-variant': '#353534',
        'tertiary-fixed-dim': '#53e16f',
        'error': '#ffb4ab',
        'secondary-fixed-dim': '#ffb4aa',
        'inverse-surface': '#e5e2e1',
        'primary-fixed-dim': '#adc6ff',
        'tertiary': '#53e16f',
        'surface-container-high': '#2a2a2a',
        'outline-variant': '#414755',
        'outline': '#8b90a0',
        'surface-container-highest': '#353534',
        'secondary-container': '#c5020b',
        'primary': '#adc6ff',
        'on-tertiary': '#003911',
        'on-error-container': '#ffdad6',
        'background': '#131313',
        'on-secondary-container': '#ffd2cc',
        'secondary': '#ffb4aa',
        'primary-fixed': '#d8e2ff',
        'on-secondary': '#690003',
        'secondary-fixed': '#ffdad5',
        'primary-container': '#4b8eff',
        'tertiary-container': '#00a741',
        'on-surface-variant': '#c1c6d7'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      spacing: {
        xs: '4px',
        md: '16px',
        gutter: '16px',
        margin: '24px',
        unit: '4px',
        xl: '40px',
        sm: '8px',
        lg: '24px'
      },
      fontFamily: {
        'body-lg': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        h2: ['Inter', 'sans-serif'],
        'label-caps': ['Inter', 'sans-serif'],
        h1: ['Inter', 'sans-serif'],
        'mono-data': ['monospace'],
        display: ['Inter', 'sans-serif']
      },
      fontSize: {
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        h2: ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'label-caps': ['12px', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '700' }],
        h1: ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'mono-data': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
        display: ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }]
      }
    }
  }
}
