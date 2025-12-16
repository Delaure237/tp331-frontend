// tailwind.config.js (ou .mjs / .cjs)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Vos chemins d'accès habituels, par exemple :
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // 👈 AJOUTEZ CECI POUR FORCER L'INCLUSION DES COULEURS DYNAMIQUES
  safelist: [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-teal-500',
  ],
  // -----------------------------------------------------------------

  theme: {
    extend: {
      // ... vos extensions de thème
    },
  },
  plugins: [
    // ... vos plugins
  ],
}