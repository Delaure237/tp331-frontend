// app/(auth)/layout.tsx

import { ReactNode } from 'react';
import "@/app/global.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (

    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}