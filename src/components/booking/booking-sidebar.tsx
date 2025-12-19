"use client";

import React from 'react';
import Image from 'next/image';
import { useBookingStore } from '@/store/booking-store';

const SIDEBAR_CONTENT = {
  1: {
    image: "https://images.unsplash.com/photo-1629909613654-28705ee67acc?q=80&w=2070",
    title: "Soins Dentaires de Qualité",
    quote: "Nos spécialistes utilisent les dernières technologies pour garantir votre confort et votre santé.",
    author: "Dr. Sarah Johnson, Chef de Clinique"
  },
  2: {
    image: "https://images.unsplash.com/photo-1505751172107-573225a94501?q=80&w=2070",
    title: "Planification Flexible",
    quote: "Votre temps est précieux. Choisissez un créneau qui s'intègre parfaitement à votre journée.",
    author: "Équipe de Réception"
  },
  3: {
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070",
    title: "Accompagnement Personnalisé",
    quote: "Chaque patient est unique. Nous adaptons notre approche à vos besoins spécifiques.",
    author: "Coordinateur des Patients"
  },
  4: {
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070",
    title: "À très bientôt !",
    quote: "Votre rendez-vous est confirmé. Vous recevrez un e-mail récapitulatif d'ici quelques instants.",
    author: "Administration de l'Hôpital"
  }
};

export default function BookingSidebar() {
  const { step } = useBookingStore();
  const content = SIDEBAR_CONTENT[step as keyof typeof SIDEBAR_CONTENT] || SIDEBAR_CONTENT[1];

  return (
    <div className="relative w-full h-full flex flex-col justify-end p-12 text-white">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={content.image}
          alt="Contexte médical"
          fill
          className="object-cover transition-all duration-1000 ease-in-out"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3D44] via-[#1A3D44]/40 to-transparent" />
      </div>

      {/* Contenu textuel */}
      <div className="relative z-10 max-w-lg animate-in fade-in slide-in-from-right-8 duration-700">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
          <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
          <p className="text-lg text-gray-200 italic mb-6">
            &ldquo;{content.quote}&rdquo;
          </p>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-1 text-[#4FD1C5] font-bold">&mdash;</div>
            <span className="text-sm font-semibold tracking-wide uppercase">
              {content.author}
            </span>
          </div>
        </div>

        {/* Indicateurs de progression */}
        <div className="mt-8 flex space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i ? "w-8 bg-[#4FD1C5]" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}