// app/auth/layout.tsx
import { Poppins } from "next/font/google";
import "@/app/global.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`
        ${poppins.variable}
        min-h-svh
        w-full
        flex
        items-center
        justify-center
        bg-gray-50
      `}
    >
      {children}
    </div>
  );
}
