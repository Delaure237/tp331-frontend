// components/ui/chart.tsx

import React from "react";

// Définition de l'interface ChartConfig (CECI EST LE CHANGEMENT CRUCIAL)
// Cela décrit la structure que l'objet de configuration du graphique doit avoir
export type ChartConfig = {
    [key: string]: { // Permet des clés dynamiques comme 'onSite', 'orders', 'sales', 'profit', etc.
        label: string;
        color: string;
        // Ajoutez d'autres propriétés si vos configurations de graphique en ont besoin
        // Par exemple: icon?: React.ElementType; unit?: string;
    };
};

// Les autres composants restent des composants React, mais ils devront être typés correctement
// Pour l'instant, nous allons les laisser en 'any' pour éviter de nouvelles erreurs de typage,
// mais idéalement, ils devraient avoir des props définies.

export const ChartContainer = ({ config, children, className, ...props }: any) => {
    // Note: Vous devrez ajouter une logique pour que ChartContainer utilise 'config'
    // Pour l'instant, il passe juste les enfants.
    // Idéalement, Shadcn UI utilise React Context pour passer la config aux enfants.
    // Puisque vous avez une version simplifiée, nous allons laisser la complexité de côté pour l'instant.
    return (
        <div className={className} {...props}>
            {children}
        </div>
    );
};

export const ChartLegend = ({ data, content, ...props }: any) => (
    // 'data' est généralement un tableau d'objets passés à Recharts Legend.
    // 'content' est une fonction ou un composant qui rend le contenu de la légende.
    <div {...props}>
        {content && React.isValidElement(content) ? content : <ChartLegendContent data={data} />}
    </div>
);

// Pour ChartTooltip, ChartLegendContent et ChartTooltipContent,
// Il faut les rendre plus fonctionnels avec les données de Recharts.
// Ce sont des versions très simplifiées.

export const ChartTooltip = ({ content, ...props }: any) => (
    <div {...props}>
        {content}
    </div>
);

export const ChartLegendContent = ({ data, ...props }: any) => (
    // Cette version de ChartLegendContent est très basique.
    // La version complète de Shadcn itère sur les 'data' passées par Recharts Legend.
    <div className="flex flex-wrap gap-2" {...props}>
        {data && data.map((entry: any) => (
            <div key={entry.id || entry.value} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.payload?.fill || 'currentColor' }}></span>
                <span>{entry.value}</span>
            </div>
        ))}
    </div>
);

export const ChartTooltipContent = ({ label, payload, formatter, ...props }: any) => {
    // Cette version de ChartTooltipContent est très basique.
    // La version complète de Shadcn utilise 'label', 'payload' pour afficher les valeurs.
    if (!payload || !payload.length) return null;

    return (
        <div className="rounded-md border bg-background px-3 py-1.5 text-sm shadow-md" {...props}>
            {label && <p className="mb-1 text-muted-foreground">{label}</p>}
            <div className="space-y-1">
                {payload.map((entry: any) => (
                    <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></span>
                            <span className="text-muted-foreground">{entry.name || entry.dataKey}</span>
                        </div>
                        <span className="font-medium text-foreground">
                            {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};