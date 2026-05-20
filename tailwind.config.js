const rgb = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './content/**/*.md',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: rgb('base'),
        surface: rgb('surface'),
        raised: rgb('raised'),
        'raised-hover': rgb('raised-hover'),
        border: rgb('border'),
        'border-subtle': rgb('border-subtle'),
        accent: rgb('accent'),
        'accent-strong': rgb('accent-strong'),
        'accent-dim': 'rgb(var(--color-accent) / 0.12)',
        'accent-fg': rgb('accent-fg'),
        'txt-primary': rgb('txt-primary'),
        'txt-secondary': rgb('txt-secondary'),
        'txt-muted': rgb('txt-muted'),
        'sp-green': rgb('sp-green'),
        'sp-green-dim': 'rgb(var(--color-sp-green) / 0.10)',
        'sp-blue': rgb('sp-blue'),
        'sp-blue-dim': 'rgb(var(--color-sp-blue) / 0.10)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        serif: ['"IBM Plex Serif"', 'serif'],
        mono: ['"Lilex"', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgb(var(--color-border))',
      },
      divideColor: {
        DEFAULT: 'rgb(var(--color-border))',
      },
      ringColor: {
        DEFAULT: 'rgb(var(--color-accent))',
      },
      boxShadow: {
        'soft': 'var(--shadow-soft)',
        'card': 'var(--shadow-card)',
        'pop':  'var(--shadow-pop)',
      },
    },
  },
  plugins: [],
}
