"use client";

import * as React from 'react';
import './global.css';
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function MainContentWrapper({ children }: { children: React.ReactNode }) {

  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  return (
    <main
      className={`flex-1 overflow-y-auto transition-all duration-200 ${
        isCollapsed ? 'ml-[60px]' : 'ml-[240px]'
      }`}
    >
      <div className="p-4 md:p-6">
        {children}
      </div>
    </main>
  );
}


export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    <SidebarProvider>
      <div className="flex min-h-screen">

        <AppSidebar isCollapsed={false} setIsCollapsed={function (value: React.SetStateAction<boolean>): void {
          throw new Error('Function not implemented.');
        } } />

        <MainContentWrapper>{children}</MainContentWrapper>

      </div>
    </SidebarProvider>
  );
}