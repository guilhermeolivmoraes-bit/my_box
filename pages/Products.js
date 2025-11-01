import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, AlertCircle, Package } from "lucide-react";

export default function Products() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.list("name"),
    initialData: [],
  });

  return (
    <div className="min-h-screen bg-white p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-black text-black">Meus Produtos</h1>
        <p className="text-lg text-gray-600 mt-1">
          {products.length} produto(s)
        </p>
      </div>

      {/* Product List */}
      <div className="space-y-3 mb-24">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Carregando produtos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-bold text-gray-400 mb-2">
              Nenhum produto cadastrado
            </p>
            <p className="text-gray-500">Clique no botão + para adicionar</p>
          </div>
        ) : (
          products.map((product) => {
            const lowStock = product.stock <= 5;
            return (
              <Link
                key={product.id}
                to={createPageUrl(`AddEditProduct?id=${product.id}`)}
              >
                <div className="bg-white border-2 border-black rounded-xl p-5 hover:bg-gray-50 active:bg-gray-100 transition-all transform active:scale-98">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-black text-black flex-1 pr-4">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-black text-[#22C55E]">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {lowStock && (
                      <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                    )}
                    <span
                      className={`text-lg font-bold ${
                        lowStock ? "text-[#EF4444]" : "text-gray-600"
                      }`}
                    >
                      Estoque: {product.stock}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Floating Action Button */}
      <Link to={createPageUrl("AddEditProduct")}>
        <button className="fixed bottom-24 right-6 w-16 h-16 bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white rounded-full shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 border-4 border-black">
          <Plus className="w-8 h-8" strokeWidth={3} />
        </button>
      </Link>
    </div>
  );
}
