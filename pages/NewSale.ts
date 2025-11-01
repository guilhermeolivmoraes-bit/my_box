import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Search, Plus, Minus, Trash2, CheckCircle, ShoppingCart } from "lucide-react";

export default function NewSale() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('name'),
    initialData: [],
  });

  const completeSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      // Criar a venda
      const sale = await base44.entities.Sale.create(saleData);
      
      // Atualizar o estoque dos produtos
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await base44.entities.Product.update(item.id, {
            stock: product.stock - item.quantity
          });
        }
      }
      
      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      navigate(createPageUrl("Dashboard"));
    },
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        const product = products.find(p => p.id === productId);
        if (newQuantity > 0 && newQuantity <= product.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
 