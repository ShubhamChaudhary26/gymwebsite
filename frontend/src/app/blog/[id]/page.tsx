"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content?: string;
}

export default function BlogDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
        setBlog(res.data?.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-gray-300">
        Loading blog details...
      </div>
    );

  if (!blog)
    return (
      <div className="text-center py-20 text-lg text-gray-300">
        Blog not found.
      </div>
    );

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        {/* Image */}
        <div className="relative w-full h-96 flex items-center justify-center bg-black">
          <img
            src={blog.image}
            alt={blog.title}
            className="max-w-full max-h-full object-contain rounded-t-2xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-10 flex flex-col">
          {/* Category & Date */}
          <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
            <span className="uppercase tracking-wide">{blog.category}</span>
            <span>
              {blog.date} • {blog.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            {blog.title}
          </h1>

          {/* Author */}
          <p className="text-gray-400 mb-6">By {blog.author}</p>

          {/* Excerpt */}
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{blog.excerpt}</p>

          {/* Content */}
          {blog.content ? (
            <div className="prose prose-invert prose-lg max-w-none text-gray-200 leading-relaxed">
              {blog.content}
            </div>
          ) : (
            <p className="text-gray-400 italic">Full content coming soon...</p>
          )}

          {/* Back Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-[#A2CD04] text-black rounded-lg font-semibold transition-transform hover:scale-105 hover:bg-[#8EBF03]"
            >
              ← Back to Blogs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
