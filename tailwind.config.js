/** Tailwind CSS build config — mirrors the former cdn.tailwindcss.com runtime config.
 *  Rebuild with:  npx tailwindcss -c tailwind.config.js -i src/tailwind.css -o css/tailwind.css --minify
 */
module.exports = {
  content: [
    './*.html',
    './blog/*.html',
    './js/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#bd1819',
          secondary: '#ff9500',
          ink: '#000000',
          muted: '#666666',
          border: '#f3f3f3',
          surface: '#ffffff',
          dark: '#131313',
        },
      },
      borderRadius: {
        design: '2px',
      },
    },
  },
  // brand-* / font-satoshi / rounded-design can be referenced from templates
  safelist: [
    'brand-primary', 'brand-secondary', 'brand-ink', 'brand-muted',
    'brand-border', 'brand-surface', 'brand-dark',
    'font-satoshi', 'rounded-design',
  ],
  plugins: [],
};
