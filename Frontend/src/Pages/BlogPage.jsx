import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api";
import Button from "../Components/Buttons/Button";
import { getImageUrl } from "../utils/getImageUrl";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 8; 

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blogs?page=${page}&limit=${limit}`);

        setBlogs(res.data.blogs || []);

       
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const getImageSrc = (src) => (src && src.trim() ? src : DEFAULT_IMAGE);
  const handleImageError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };
  const getImageClass = (src) =>
    getImageSrc(src) === DEFAULT_IMAGE
      ? "object-contain bg-black"
      : "object-cover";

  if (loading) return <p className="text-center py-10">Loading blogs...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!blogs.length) return <p className="text-center py-10">No blogs found.</p>;

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 py-10">
      <motion.h1
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        All Blogs
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <motion.div
            key={blog._id}
            className="relative rounded-lg overflow-hidden h-[300px] group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
          >
            <Link to={`/blogs/${ blog._id}`}>
            <img
  src={getImageUrl(blog.image)}
  alt={blog.title}
  onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
  className={`w-full h-full ${getImageUrl(blog.image) === DEFAULT_IMAGE ? "object-contain bg-black" : "object-cover"} transform group-hover:scale-105 transition duration-500`}
/>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3 md:p-5 text-white font-semibold text-base md:text-xl">
                {blog.title}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
  <Button onClick={handlePrev} disabled={page === 1}>
    Prev
  </Button>

  <span className="flex items-center text-gray-700 font-semibold">
    Page {page} of {totalPages}
  </span>

  <Button onClick={handleNext} disabled={page === totalPages}>
    Next
  </Button>
</div>
    </section>
  );
};

export default BlogPage;
