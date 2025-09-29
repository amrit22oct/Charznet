import React from "react";
import { motion } from "framer-motion";
import ArticleList from "./ArticleList";

const ContentSection = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100">
      {/* Page Header */}
      <div className="max-w-5xl text-gray-900 text-center mb-8">
        <h1 className="text-4xl font-extrabold font-mono capitalize mt-10">
          Latest Events Around the Globe
        </h1>
        <p className="mt-5 px-4 sm:px-8 leading-relaxed">
          The world never stands still—and neither should you. From
          groundbreaking discoveries to unexpected global shifts, every day
          unfolds a new chapter worth exploring.
        </p>
      </div>

      {/* Articles Section */}
      <motion.div
        className="w-full min-h-[60vh] bg-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="px-4 sm:px-6 lg:px-8 mx-12">
          <ArticleList />
        </div>
      </motion.div>
    </div>
  );
};

export default ContentSection;
