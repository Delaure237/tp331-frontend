/** @type {import('next').NextConfig} */
const nextConfig = {
  safelist: [
    // Liste des classes de couleurs d'avatar utilisées dans generateAvatarProps
    'bg-blue-500', 
    'bg-indigo-500', 
    'bg-purple-500', 
    'bg-pink-500', 
    'bg-red-500', 
    'bg-orange-500', 
    'bg-green-500', 
    'bg-teal-500',
    // Classes pour le texte et les autres styles non-générés dynamiquement
    'text-white', 
    'h-10', 'w-10', 'h-28', 'w-28', // si elles n'apparaissent pas ailleurs
    'ring-4', 'ring-indigo-50', // pour le profile view
    // Si vous utilisez d'autres couleurs dynamiques, ajoutez-les ici
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.futura-sciences.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
