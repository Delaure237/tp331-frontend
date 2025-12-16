// src/lib/utils.ts (Ajouter cette fonction à vos utilitaires existants)

/**
 * Génère des initiales et une couleur de fond aléatoire (stable pour un nom donné) pour un avatar.
 * @param name Le nom complet du docteur.
 * @returns { initials: string, bgColorClass: string }
 */
export function generateAvatarProps(name: string): { initials: string; bgColorClass: string } {
    if (!name) {
        return { initials: '?', bgColorClass: 'bg-gray-500' };
    }

    // 1. Générer une graine (seed) stable pour le nom (simple hash)
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // 2. Définir une palette de couleurs Tailwind
    const colors = [
        'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
        'bg-pink-500', 'bg-red-500', 'bg-orange-500',
        'bg-green-500', 'bg-teal-500'
    ];

    // Utiliser le hash pour choisir une couleur de manière stable
    const colorIndex = Math.abs(hash) % colors.length;
    const bgColorClass = colors[colorIndex];

    // 3. Extraire les initiales
    const nameParts = name.trim().split(/\s+/);
    let initials = '';

    if (nameParts.length > 1) {
        // Première lettre du prénom et du nom
        initials = nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase();
    } else if (nameParts.length === 1) {
        // Première lettre si un seul mot
        initials = nameParts[0][0].toUpperCase();
    }

    return { initials, bgColorClass };
}