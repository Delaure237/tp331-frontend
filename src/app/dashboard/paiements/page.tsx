// src/app/dashboard/payments/page.tsx
import { MethodCard } from "@/components/payments/method-card";
import { Button } from "@/components/ui/button";
import { Filter, Search, Plus } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="p-8 space-y-10 bg-[#fcfcfd] min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Soldes</h1>
          <p className="text-sm text-gray-500 font-medium">
            Fonds totaux : <span className="text-gray-900 font-semibold">3 160 000 FCFA</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-200 text-gray-600 rounded-xl px-4 h-10 text-xs font-medium">
            Historique complet
          </Button>
          <Button className="bg-[#058D66] hover:bg-[#047a57] text-white rounded-xl px-5 h-10 text-xs font-medium gap-2">
            <Plus className="w-4 h-4" /> Retirer des fonds
          </Button>
        </div>
      </div>

      {/* Grid des Moyens de Paiement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MethodCard
          name="Carte Bancaire"
          balance="1 240 000"
          currency="FCFA"
          imagePath="/card.svg"
        />
        <MethodCard
          name="Orange Money"
          balance="500 000"
          currency="FCFA"
          imagePath="/orange_logo.svg"
        />
        <MethodCard
          name="MTN MoMo"
          balance="710 000"
          currency="FCFA"
          imagePath="/mtn_logo.svg"
        />
        <MethodCard
          name="Espèces"
          balance="710 000"
          currency="FCFA"
          isCash={true}
        />
      </div>

      {/* Section Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-800">Transactions récentes</h2>
          <Button variant="ghost" className="h-8 text-xs font-medium text-gray-400 hover:text-gray-900 gap-2">
             <Filter className="w-3.5 h-3.5" /> Filtrer par date
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                <th className="px-6 py-4">Date de l'opération</th>
                <th className="px-6 py-4">Libellé / Patient</th>
                <th className="px-6 py-4">Mode de paiement</th>
                <th className="px-6 py-4 text-right">Montant</th>
                <th className="px-6 py-4 text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-6 py-28 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-gray-50 rounded-full">
                        <Search className="w-6 h-6 text-gray-200" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">Aucune transaction</p>
                        <p className="text-xs text-gray-400">Vos flux financiers apparaîtront ici</p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}