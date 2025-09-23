import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import Button from "../Components/Buttons/Button";
import DefaultImage from "../assets/CharzNet.jpg";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const DEFAULT_IMAGE = DefaultImage;

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get(`/articles?limit=4`);
        setArticles(res.data.articles || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch articles.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleImageError = (id) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const getImageSrc = (article) =>
  brokenImages[article._id] || !article.image?.trim()
    ? DEFAULT_IMAGE
    : `${API.defaults.baseURL}${article.image}`;


  const getImageClass = (article) =>
    brokenImages[article._id] || !article.image?.trim()
      ? "object-contain bg-black"
      : "object-cover";

  // ✅ Skeleton loader
  const SkeletonCard = ({ className }) => (
    <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
  );

  if (error)
    return <p className="text-center py-10 text-red-600">{error}</p>;

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
          Latest News Articles
        </h1>
        <Button onClick={() => navigate("/all-articles")}>
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
        NUckb sakfud sruebcs isfnceg sfateg skikjfhg dster jhdsfs bcua gfsad
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First (big) article */}
        {loading ? (
          <SkeletonCard className="h-[400px] md:h-[732px]" />
        ) : (
          articles[0] && (
            <motion.div
              className="relative rounded-lg overflow-hidden h-[400px] md:h-[732px] group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              initial="hidden"
              whileInView="visible"
              variants={fadeInUp}
              viewport={{ once: true }}
            >
              <Link to={`/articles/${articles[0].slug || articles[0]._id}`}>
                <img
                  src={getImageSrc(articles[0])}
                  alt={articles[0].title}
                  onError={() => handleImageError(articles[0]._id)}
                  className={`w-full h-full ${getImageClass(
                    articles[0]
                  )} group-hover:scale-105 transition duration-500`}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-4 md:p-6 text-white font-semibold text-lg md:text-2xl lg:text-3xl">
                  {articles[0].title}
                </div>
              </Link>
            </motion.div>
          )
        )}

        {/* Right side (3 smaller articles) */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex flex-col sm:flex-row gap-6">
            {loading
              ? [1, 2].map((i) => (
                  <SkeletonCard
                    key={i}
                    className="flex-1 h-[300px] sm:h-[416px]"
                  />
                ))
              : articles.slice(1, 3).map(
                  (article) =>
                    article && (
                      <motion.div
                        key={article._id}
                        className="relative rounded-lg overflow-hidden flex-1 h-[300px] sm:h-[416px] group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeInUp}
                        viewport={{ once: true }}
                      >
                        <Link
                          to={`/articles/${article.slug || article._id}`}
                        >
                          <img
                            src={getImageSrc(article)}
                            alt={article.title}
                            onError={() => handleImageError(article._id)}
                            className={`w-full h-full ${getImageClass(
                              article
                            )} group-hover:scale-105 transition duration-500`}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3 md:p-5 text-white font-semibold text-base md:text-xl">
                            {article.title}
                          </div>
                        </Link>
                      </motion.div>
                    )
                )}
          </div>

          {loading ? (
            <SkeletonCard className="h-[200px] sm:h-[292px]" />
          ) : (
            articles[3] && (
              <motion.div
                className="relative rounded-lg overflow-hidden h-[200px] sm:h-[292px] group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                initial="hidden"
                whileInView="visible"
                variants={fadeInUp}
                viewport={{ once: true }}
              >
                <Link to={`/articles/${articles[3].slug || articles[3]._id}`}>
                  <img
                    src={getImageSrc(articles[3])}
                    alt={articles[3].title}
                    onError={() => handleImageError(articles[3]._id)}
                    className={`w-full h-full ${getImageClass(
                      articles[3]
                    )} group-hover:scale-105 transition duration-500`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-3 md:p-5 text-white font-semibold text-sm md:text-lg lg:text-xl">
                    {articles[3].title}
                  </div>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Articles;
