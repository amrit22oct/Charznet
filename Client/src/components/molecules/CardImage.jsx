// CardImage.jsx
import React from "react";
import { motion } from "framer-motion";

const CardImage = ({ bgImage }) => {
  return (
    <div className="absolute inset-0">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        animate={{ backgroundPositionX: ["0%", "20%", "0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover:bg-black/30 transition-all duration-300" />
    </div>
  );
};

export default CardImage;
