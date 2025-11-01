import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";

export default function AddEditProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const isEdit = !!productId;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: ''
  });

  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => base44.entities.Product.list().then(products => 
      products.find(p => p.id === productId)
    ),
    enabled: isEdit,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString()
      });
    }
  }, [product]);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.create({
      name: data.name,
      price: parseFloat(data.price),
      stock: parseInt(data.stock)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(createPageUrl("Products"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Product.update(productId, {
      name: data.name,
      price: parseFloat(data.price),
      stock: parseInt(data.stock)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(createPageUrl("Products"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Product.delete(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate(createPageUrl("Products"));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate(formData);
 