"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  photo: string;
}

interface ApiResponse {
  success: boolean;
  data: Product[];
  message: string;
}

interface ProductsProps {
  limit?: number; // optional limit prop
}

export default function Products({ limit }: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: ApiResponse = await res.json();
        // agar limit pass ho to slice kar do, nahi to saare products
        setProducts(limit ? data.data.slice(0, limit) : data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [limit]);

  if (loading) return <div className="text-center text-[#A2CD04] py-20">Loading...</div>;
  if (error) return <div className="text-center text-[#A2CD04] py-20">{error}</div>;
  if (!products.length) return <div className="text-center text-[#A2CD04] py-20">No products available</div>;

  return (
    <div className="bg-black min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Shop Our Products</h1>
        <p className="text-lg text-gray-300">High-quality fitness equipment and supplements to enhance your workout</p>
      </div>
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {products.map((p) => (
    <div
      key={p._id}
      className="bg-gray-900 rounded-lg shadow-lg cursor-pointer hover:shadow-xl flex flex-col"
      onClick={() => router.push(`/products/${p._id}`)}
    >
      <div className="relative h-64 w-full">
        <img
          src={p.photo || "/placeholder-product.jpg"}
          alt={p.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">{p.name}</h2>
          <p className="text-gray-300 mb-4 line-clamp-2">{p.description}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-[#A2CD04]">₹{p.price}</span>
          <span className="bg-[#A2CD04] hover:bg-[#8EBF03] text-black font-bold py-2 px-4 rounded-lg transition-colors duration-300">
            View Details
          </span>
        </div>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
