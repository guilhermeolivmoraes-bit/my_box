import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Package, ShoppingCart, BarChart3 } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: createPageUrl("Dashboard") },
    { name: "Produtos", icon: Package, path: createPageUrl("Products") },
    { name: "Vender", icon: ShoppingCart, path: createPageUrl("NewSale") },
    { name: "Relatórios", icon: BarChart3, path: createPageUrl("Reports") }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        :root {
          --primary: #22C55E;
          --danger: #EF4444;
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black">
        <div className="grid grid-cols-4 max-w-2xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center py-3 transition-colors ${
                  isActive ? 'text-[var(--primary)]' : 'text-black'
                }`}
 