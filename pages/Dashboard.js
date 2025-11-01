import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingCart, Package, BarChart3 } from "lucide-react";
import { format, startOfDay, endOfDay } from "date-fns";

export default function Dashboard() {
  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: () => base44.entities.Sale.list("-created_date"),
    initialData: [],
  });

  // Calcular vendas de hoje
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const todaySales = sales.filter((sale) => {
    const saleDate = new Date(sale.sale_date);
    return saleDate >= todayStart && saleDate <= todayEnd;
  });

  const todayTotal = todaySales.reduce(
    (sum, sale) => sum + (sale.total || 0),
    0
  );

  return (
    <div className="min-h-screen bg-white p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-black mb-2">Meu Caixa</h1>
        <p className="text-lg text-gray-600">{format(today, "dd/MM/yyyy")}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to={createPageUrl("NewSale")}>
          <button className="w-full bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg">
            <ShoppingCart className="w-12 h-12" strokeWidth={2.5} />
            <span className="text-xl font-black">Registrar Venda</span>
          </button>
        </Link>

        <Link to={createPageUrl("Products")}>
          <button className="w-full bg-black hover:bg-gray-800 active:bg-gray-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg">
            <Package className="w-12 h-12" strokeWidth={2.5} />
            <span className="text-xl font-black">Meus Produtos</span>
          </button>
        </Link>
      </div>

      {/* Today's Sales Card */}
      <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-lg mb-6">
        <p className="text-lg font-bold text-gray-600 mb-2">Vendas de Hoje</p>
        <p className="text-5xl font-black text-[#22C55E]">
          R$ {todayTotal.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {todaySales.length} venda(s)
        </p>
      </div>

      {/* Reports Link */}
      <Link to={createPageUrl("Reports")}>
        <button className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border-2 border-black rounded-2xl p-5 flex items-center justify-between transition-all transform active:scale-95">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-black" strokeWidth={2.5} />
            <span className="text-xl font-black text-black">
              Ver Relatórios
            </span>
          </div>
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </Link>
    </div>
  );
}
