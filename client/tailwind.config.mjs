/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Luxurious light color palette
        cream: '#F9F5EB',
        sand: '#E5DCC5',
        gold: '#D4B483',
        taupe: '#C1A78E',
        mocha: '#7D6E5B',
        charcoal: '#2D2A24',
        sage: '#CAD2C5',
        rose: '#F6E6E4',
        slate: '#E2E8F0',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'elegant': '0 8px 30px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
