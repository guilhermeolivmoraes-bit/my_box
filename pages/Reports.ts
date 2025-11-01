import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";

export default function Reports() {
  const navigate = useNavigate();

  const { data: sales = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => base44.entities.Sale.list('-created_date'),
    initialData: [],
  });

  // Calcular vendas de hoje
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  const todaySales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return saleDate >= todayStart && saleDate <= todayEnd;
  });

  const todayTotal = todaySales.reduce((sum, sale) => sum + (sale.total || 0), 0);

  // Calcular vendas do mês
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  const monthSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return saleDate >= monthStart && saleDate <= monthEnd;
  });

  const monthTotal = monthSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

  return (
    <div className="min-h-screen bg-white p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-8 h-8 text-black" strokeWidth={2.5} />
        </button>
        <h1 className="text-4xl font-black text-black">Relatórios</h1>
      </div>

      {/* Daily Sales Card */}
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-[#22C55E] rounded-xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-600">VENDAS DE HOJE</p>
            <p className="text-lg font-bold text-gray-500">{todaySales.length} venda(s)</p>
          </div>
        </div>
        <p className="text-6xl font-black text-black mb-2">
          R$ {todayTotal.toFixed(2)}
        </p>
      </div>

      {/* Monthly Sales Card */}
      <div className="bg-white border-4 border-black rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" strokeWidth={2.5} />
 