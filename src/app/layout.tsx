// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { AuthProvider } from "@/context/auth-context";

import "@/app/global.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HospiCare - Tableau de bord",
  description: "Application de gestion hospitalière",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} h-full w-full`}>
      <body className="m-0 p-0 antialiased h-full w-full overflow-x-hidden">
        <AuthProvider>
          <ReactQueryProvider>
            <NuqsAdapter>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </NuqsAdapter>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
