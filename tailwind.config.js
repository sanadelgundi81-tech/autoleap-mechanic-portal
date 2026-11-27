/** @type {import('tailwindcss').Config} */

// Themed palettes: each shade reads a CSS variable from src/theme.css, so the
// same classes (bg-slate-900, text-blue-400, …) follow the light/dark theme.
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const themed = (name) =>
  Object.fromEntries(SHADES.map((s) => [s, `rgb(var(--c-${name}-${s}) / <alpha-value>)`]))

export default {
  // The theme toggle puts "dark" on <html>; default is dark (see index.html).
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: themed('slate'),
        blue: themed('blue'),
        emerald: themed('emerald'),
        amber: themed('amber'),
        red: themed('red'),
        rose: themed('rose'),
        sky: themed('sky'),
        teal: themed('teal'),
        violet: themed('violet'),
        /** Strongest text colour (headings): white in dark, near-black in light. */
        white: 'rgb(var(--c-white) / <alpha-value>)',
        /** Text on a coloured (blue / red / green) button: white in both themes. */
        onaccent: '#ffffff',
        /** Print sheets (invoice, inspection report): always white paper. */
        paper: '#ffffff',
        page: {
          bg: 'rgb(var(--c-page-bg) / <alpha-value>)',
          fg: 'rgb(var(--c-page-fg) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
