"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  photo?: string;
};

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!params.id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/products/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.data as Product);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);





  if (!product) {
    return (
      <div className="bg-black min-h-screen flex justify-center items-center">
        <p className="text-white text-2xl">Product not found</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen py-20 px-1 sm:px-6 lg:px-12">
      <div className="max-w-8xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
          <img
            src={product.photo || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover "
          />
        </div>

        {/* Product Details */}
        <div className="text-white flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-[#A2CD04]">{product.name}</h1>
            <p className="text-3xl font-semibold mb-6 text-white">₹{product.price.toFixed(2)}</p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-[#A2CD04]">Description</h2>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-6">
            
            <button
              onClick={() => router.back()}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 w-full sm:w-auto"
            >
              ← Back to Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
