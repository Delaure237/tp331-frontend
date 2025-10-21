// src/app/(auth)/signup/page.tsx

/* eslint-disable @next/next/no-img-element */
import { RegisterMultistep } from "@/components/forms/register-multistep"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function SignupPage() {

    const BACKGROUND_IMAGE_URL = 'https://cdn.futura-sciences.com/cdn-cgi/image/width=1024,quality=50,format=auto/sources/images/hygiene-hopital.jpg';
    const ALT_TEXT = "Image d'arrière-plan de l'hôpital";

    return (
        // 🎯 CORRECTION: Le conteneur MINIMAL pour la page Signup
        // Il doit occuper tout l'espace (w-full h-full) pour que la grille ci-dessous fonctionne.
        <div className="w-full h-full">

            {/* La grille 50/50 doit être pleine hauteur */}
            <div className="grid min-h-svh lg:grid-cols-2">

                {/* Colonne du formulaire (50%) */}
                <div className="flex flex-col gap-4 p-6 md:p-10">

                    {/* 1. Zone du Logo/Titre */}
                    <div className="flex justify-center gap-2 md:justify-start">
                        <a href="#" className="flex items-center gap-2 font-medium">
                            <h1 className="text-xl font-extrabold tracking-tight">
                                <span
                                    className={cn(
                                        "bg-clip-text text-transparent",
                                        "bg-gradient-to-r from-green-700 to-blue-400"
                                    )}
                                >
                                    HospiCare
                                </span>
                            </h1>
                        </a>
                    </div>

                    {/* 2. Conteneur principal du formulaire : Utilise toute la hauteur restante (flex-1) */}
                    <div className="flex flex-1 justify-center">

                        {/* Conteneur de RegisterMultistep : utilise la largeur et la hauteur complètes disponibles */}
                        <div className="w-full h-full max-w-xl">
                            <RegisterMultistep />
                        </div>
                    </div>
                </div>

                {/* Colonne de l'image (Latérale - 50%) */}
                <div className="bg-muted relative hidden lg:block">
                    <Image
                        src={BACKGROUND_IMAGE_URL}
                        alt={ALT_TEXT}
                        fill
                        priority
                        sizes="(max-width: 1024px) 0vw, 50vw"
                        className="object-cover dark:brightness-[0.2] dark:grayscale"
                    />
                </div>
            </div>
        </div>
    );
}