import React from "react";
import { motion } from "framer-motion";

const ArticleImage = ({ image, title, text, delay = 0, big = false }) => {
  return (
    <motion.div
      className={`relative w-full rounded-2xl shadow-xl overflow-hidden cursor-pointer group ${
        big ? "h-96 md:h-[28rem]" : "h-48 md:h-56"
      }`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-all duration-500 brightness-80 group-hover:brightness-110 group-hover:scale-100"
      />
      <div className="absolute left-0 bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6 flex flex-col justify-end">
        <h2
          className={`${
            big ? "text-xl md:text-2xl" : "text-lg md:text-xl"
          } font-bold text-white mb-1`}
        >
          {title}
        </h2>
        <p
          className={`${
            big ? "text-base md:text-lg" : "text-sm md:text-base"
          } text-white`}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
};

export default ArticleImage;
