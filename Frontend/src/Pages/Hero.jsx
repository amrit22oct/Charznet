import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { getImageUrl } from "../utils/getImageUrl";
import { motion } from "framer-motion";

const Hero = () => {
  const [articles, setArticles] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get("/articles?limit=2&page=1"); // fetch up to 2 articles
        return res.data.articles || [];
      } catch (err) {
        console.error("Failed to fetch articles", err);
        return [];
      }
    };

    const fetchBlogs = async () => {
      try {
        const res = await API.get("/blogs?limit=2&page=1"); // fetch up to 2 blogs
        return res.data.blogs || [];
      } catch (err) {
        console.error("Failed to fetch blogs", err);
        return [];
      }
    };

    const fetchData = async () => {
      setLoading(true);
      const [fetchedArticles, fetchedBlogs] = await Promise.all([
        fetchArticles(),
        fetchBlogs(),
      ]);

      setArticles(fetchedArticles);
      setBlogs(fetchedBlogs);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCardClick = (type, id) => {
    if (type === "article") navigate(`/articles/${id}`);
    if (type === "blog") navigate(`/blogs/${id}`);
  };

  const SkeletonCard = ({ className }) => (
    <div
      className={`relative rounded-[24px] bg-gray-200 animate-pulse ${className}`}
    >
      <div className="absolute bottom-4 left-4 right-4 h-6 bg-gray-300 rounded"></div>
    </div>
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const renderCard = (content, type, widthClass) => {
    if (loading) {
      return (
        <SkeletonCard
          className={`${widthClass} h-[300px] sm:h-[400px] md:h-[600px]`}
        />
      );
    }

    if (!content) {
      return (
        <div
          className={`${widthClass} h-[300px] sm:h-[400px] md:h-[600px] flex items-center justify-center bg-gray-100 rounded-[24px]`}
        >
          <p className="text-gray-500 text-lg">No content found.</p>
        </div>
      );
    }

    return (
      <motion.div
        key={content._id}
        className={`relative rounded-[24px] overflow-hidden ${widthClass} h-[300px] sm:h-[400px] md:h-[600px] cursor-pointer group`}
        onClick={() => handleCardClick(type, content._id)}
        whileHover={{ scale: 1.0 }}
        transition={{ duration: 0.3 }}
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <motion.img
          src={
            type === "article"
              ? content.image || "https://placehold.co/600x600?text=No+Image+available"
              : getImageUrl(content.image)
          }
          alt={content.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white text-[16px] sm:text-[20px] md:text-[28px] lg:text-[36px] font-semibold p-3 md:p-4 rounded-lg drop-shadow-lg">
          {content.title}
        </div>
      </motion.div>
    );
  };

  // Determine what to show in each container
  let leftContent = null;
  let rightContent = null;

  if (articles.length > 0 && blogs.length > 0) {
    // Both APIs succeeded: left = article, right = blog
    leftContent = articles[0];
    rightContent = blogs[0];
  } else if (articles.length > 0) {
    // Only articles available: show 2 different articles if possible
    leftContent = articles[0];
    rightContent = articles[1] || articles[0];
  } else if (blogs.length > 0) {
    // Only blogs available: show 2 different blogs if possible
    leftContent = blogs[0];
    rightContent = blogs[1] || blogs[0];
  }

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-6">
        {renderCard(
          leftContent,
          leftContent && articles.includes(leftContent) ? "article" : "blog",
          "w-full md:w-[670px]"
        )}
        {renderCard(
          rightContent,
          rightContent && articles.includes(rightContent) ? "article" : "blog",
          "w-full md:w-[546px]"
        )}
      </div>
    </section>
  );
};

export default Hero;
