// src/components/payments/method-card.tsx
import Image from "next/image";
import { Banknote } from "lucide-react";

interface MethodCardProps {
  name: string;
  balance: string;
  currency: string;
  imagePath?: string;
  isCash?: boolean;
}

export function MethodCard({ name, balance, currency, imagePath, isCash }: MethodCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-white hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 flex items-center justify-center bg-gray-50 rounded-lg">
          {isCash ? (
            <Banknote className="h-6 w-6 text-emerald-600" />
          ) : (
            imagePath && (
              <Image
                src={imagePath}
                alt={name}
                width={28}
                height={28}
                className="object-contain"
              />
            )
          )}
        </div>
        <p className="text-sm font-medium text-gray-500">{name}</p>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold text-gray-900 tracking-tight">{balance}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase">{currency}</span>
      </div>
    </div>
  );
}