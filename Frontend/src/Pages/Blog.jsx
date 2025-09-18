import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BlogModal from "../Components/BlogModal";
import Button from "../Components/Buttons/Button";
import API from "../api";
import { useNavigate } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});
  const navigate = useNavigate();

  // ✅ Get token and current user ID
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user")); // user object with _id
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs?limit=5", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const blogList = Array.isArray(res.data.blogs)
          ? res.data.blogs
          : [res.data];
        setBlogs(blogList);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [token]);

  const getImageSrc = (blog) =>
    brokenImages[blog._id] || !blog.image?.trim()
      ? DEFAULT_IMAGE
      : blog.image;

  const getImageClass = (blog) =>
    brokenImages[blog._id] || !blog.image?.trim()
      ? "object-contain bg-black"
      : "object-cover";

  // ✅ Skeleton loader for consistent layout
  const SkeletonCard = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`}></div>
  );

  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Latest Blogs
        </h1>
        <Button onClick={() => navigate("/all-blogs")}>
          View all {">>"}
        </Button>
      </motion.div>

      <motion.p
        className="text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Explore the latest insights and stories from our blog.
      </motion.p>

      {/* Grid Layout */}
      <div className="flex flex-col md:flex-row gap-6 md:h-[984px]">
        {/* Left Column */}
        <div className="flex flex-col gap-6 flex-1 min-w-[280px]">
          {loading
            ? [1, 2].map((i) => (
                <SkeletonCard key={i} className="h-[300px] md:h-[400px]" />
              ))
            : blogs.slice(0, 2).map((blog) => (
                <BlogModal
                  key={blog._id}
                  id={blog._id}
                  title={blog.title}
                  content={blog.content}
                  author={blog.author?.name || "Unknown"}
                  image={getImageSrc(blog)}
                  tags={blog.tags}
                  token={token}                 // ✅ pass JWT
                  currentUserId={currentUserId} // ✅ pass user ID
                />
              ))}
        </div>

        {/* Middle Column */}
        <div className="min-w-[300px] flex flex-col">
          {loading ? (
            <SkeletonCard className="h-full" />
          ) : (
            blogs[2] && (
              <BlogModal
                key={blogs[2]._id}
                id={blogs[2]._id}
                title={blogs[2].title}
                content={blogs[2].content}
                author={blogs[2].author?.name || "Unknown"}
                image={getImageSrc(blogs[2])}
                tags={blogs[2].tags}
                token={token}
                currentUserId={currentUserId}
                className="h-full"
              />
            )
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 flex-1 min-w-[280px]">
          {loading
            ? [3, 4].map((i) => (
                <SkeletonCard key={i} className="h-[300px] md:h-[400px]" />
              ))
            : blogs.slice(3, 5).map((blog) => (
                <BlogModal
                  key={blog._id}
                  id={blog._id}
                  title={blog.title}
                  content={blog.content}
                  author={blog.author?.name || "Unknown"}
                  image={getImageSrc(blog)}
                  tags={blog.tags}
                  token={token}                 // ✅ pass JWT
                  currentUserId={currentUserId} // ✅ pass user ID
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
