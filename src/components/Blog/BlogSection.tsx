"use client";

const BlogSection = () => {
  const blogPosts = [
    {
      title: "5 Science-Backed Ways to Boost Your Metabolism",
      excerpt:
        "Discover the latest research on metabolic enhancement and how to implement these strategies in your daily routine for maximum fat burning potential.",
      author: "Dr. Sarah Johnson",
      date: "Dec 15, 2024",
      readTime: "7 min read",
      category: "Nutrition",
      image:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "The Ultimate Guide to Progressive Overload",
      excerpt:
        "Master the fundamental principle that drives muscle growth and strength gains. Learn how to systematically increase training demands for continuous progress.",
      author: "Mike Rodriguez",
      date: "Dec 12, 2024",
      readTime: "12 min read",
      category: "Training",
      image:
        "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Mental Health Benefits of Regular Exercise",
      excerpt:
        "Explore the powerful connection between physical activity and mental wellness. Understand how exercise can be your best tool for stress management.",
      author: "Lisa Chen",
      date: "Dec 10, 2024",
      readTime: "9 min read",
      category: "Wellness",
      image:
        "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="text-neon">Articles</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with expert tips, guides, and research-backed fitness
            insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-card rounded-xl overflow-hidden shadow-lg card-hover"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <span className="text-sm text-primary font-semibold">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
