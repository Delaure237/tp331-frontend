// src/components/ui/tabs.tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-start text-muted-foreground",
      "w-full", // Plus de border-b ici. La ligne de séparation sera gérée ailleurs.
      "space-x-8", // Espacement plus grand entre les onglets
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// --- TabIndicator component ---
interface TabIndicatorProps {
  left: number;
  width: number;
}

const TabIndicator: React.FC<TabIndicatorProps> = ({ left, width }) => {
  return (
    <div
      // MODIFICATION ICI : 'bottom-[0px]' devient 'bottom-[8px]' ou 'bottom-[6px]'
      // Si TabsTrigger a py-3 (12px), un bottom de 8px le placera à 4px du bord.
      // Ajustez cette valeur pour que l'indicateur se positionne sous le texte mais au-dessus de la bordure basse de TabsTrigger
      // et donc bien au-dessus de la ligne de séparation de la TabsList.
      className="absolute bottom-[6px] h-1 bg-blue-600 rounded-full transition-all duration-200 ease-in-out" // <-- AJUSTEMENT DE BOTTOM
      style={{ left: `${left}px`, width: `${width}px` }}
    />
  );
};

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // MODIFICATION ICI : Augmenter le padding vertical pour laisser de la place à l'indicateur
      "inline-flex items-center justify-center whitespace-nowrap px-3 py-3 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // <-- py-3 au lieu de py-2
      "bg-transparent text-gray-500 hover:text-gray-700",
      "data-[state=active]:text-gray-900 data-[state=active]:font-semibold",
      "z-20", // Texte au-dessus de l'indicateur
      className
    )}
    {...props}
  >
    {children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent, TabIndicator }