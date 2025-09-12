import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api";
import Button from "../Components/Buttons/Button";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 8; 

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/articles?page=${page}&limit=${limit}`);
        setArticles(res.data.articles || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
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

  if (loading) return <p className="text-center py-10">Loading articles...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!articles.length)
    return <p className="text-center py-10">No articles found.</p>;

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
        All Articles
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <motion.div
            key={article._id}
            className="relative rounded-lg overflow-hidden h-[300px] group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
          >
            <Link to={`/articles/${article.slug || article._id}`}>
              <img
                src={getImageSrc(article.image)}
                alt={article.title}
                onError={handleImageError}
                className={`w-full h-full ${getImageClass(
                  article.image
                )} transform group-hover:scale-105 transition duration-500`}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3 md:p-5 text-white font-semibold text-base md:text-xl">
                {article.title}
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

export default ArticlePage;
