import React from "react";
import { motion } from "framer-motion";

const CardContent = ({ title, description, catogary }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 md:p-8">
      {/* Category */}
      {catogary && (
        <p className="text-indigo-300 uppercase tracking-widest mb-2 text-sm">
          {catogary}
        </p>
      )}

      {/* Title */}
      <h2 className="text-white font-extrabold text-3xl md:text-4xl lg:text-5xl mb-4 font-serif hover:text-amber-200">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <motion.p
          className="text-gray-200 text-base md:text-lg leading-relaxed"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

export default CardContent;
