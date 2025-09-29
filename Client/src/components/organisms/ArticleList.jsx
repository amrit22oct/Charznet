import React from "react";
import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";
import articles from "../../constants/articles";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3, 
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 10 
    } 
  },
};

const ArticleList = () => {
  return (
    <motion.div
      className="w-full flex justify-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="show" 
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 justify-items-center max-w-[1500px]">
        {articles.map((article) => (
          <motion.div key={article.id} variants={cardVariants}>
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ArticleList;
