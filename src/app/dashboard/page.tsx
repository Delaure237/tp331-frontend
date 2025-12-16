// src/app/dashboard/page.tsx

export default function DashboardPage() {
    return (
        // Utilise h-full pour prendre toute la hauteur du conteneur parent (main/div du Layout).
        // flex et justify-center pour centrer.
        <div className="flex flex-col items-center justify-center h-full w-full">

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-center text-gray-800 dark:text-gray-50">
                Bienvenue dans HospiCare
            </h1>

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 text-center max-w-xl">
                Ceci est la page d'accueil de votre application.
                Le texte est centré au milieu de l'écran.
            </p>

        </div>
    );
}