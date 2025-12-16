"use client";

import * as React from 'react';
import { useState, useMemo, createContext, useContext } from 'react';

// 1. Définir l'interface du contexte
interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

// 2. Créer le contexte avec une valeur par défaut non-utilisable (pour forcer l'utilisation du hook)
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 3. Créer le hook pour utiliser le contexte
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// 4. Le Provider qui gère l'état et l'expose
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Initialisez l'état du collapse (e.g., false par défaut = ouvert)
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fonction pour basculer l'état
  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Mémoriser la valeur du contexte pour optimiser les rendus
  const value = useMemo(() => ({
    isCollapsed,
    toggleCollapse,
  }), [isCollapsed, toggleCollapse]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}