"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
}

interface BlogSectionProps {
  limit?: number; // optional prop for showing only first N blogs
}

const BlogSection = ({ limit }: BlogSectionProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/blogs");
        let allBlogs = res.data?.data || [];
        // Sort by date descending
        allBlogs = allBlogs.sort(
          (a: Blog, b: Blog) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        if (limit) allBlogs = allBlogs.slice(0, limit);
        setBlogs(allBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [limit]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p>Loading blogs...</p>
      </div>
    );
  }

  if (!blogs.length) {
    return (
      <div className="text-center py-20">
        <p>No blogs found</p>
      </div>
    );
  }

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="textHeadingmobile md:textHeadinglaptop">
            Latest <span className="text-default">Articles</span>
          </h2>
          <p className="textafterHeading max-w-3xl mx-auto">
            Stay informed with expert tips, guides, and research-backed fitness
            insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post._id}
              className="bg-graydefault rounded-xl overflow-hidden shadow-lg card-hover flex flex-col"
            >
              <div className="relative w-full h-56 rounded-t-xl bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm text-default font-semibold">
                  {post.category}
                </span>
                <h3 className="mt-2 text-2xl font-bold">{post.title}</h3>
                <p className="mt-4 text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>{post.author}</span>
                  <span>
                    {post.date} • {post.readTime}
                  </span>
                </div>
                <div className="mt-6 justify-end text-end">
                  <button className="px-2 py-2 bg-default text-black rounded-lg transition">
                    <Link href={`/blog/${post._id}`}>View More</Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
