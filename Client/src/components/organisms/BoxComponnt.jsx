import React, { useRef } from "react";
import { motion } from "framer-motion";
import Carousel from "../atoms/Carousels";

const BoxComponent = () => {
  const constraintsRef = useRef(null);

  return (
    <div
      className="w-full h-[550px] md:h-[600px] lg:h-[600px] relative flex items-center justify-center"
      ref={constraintsRef}
    >
      {/* Responsive Carousel Background */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <Carousel />
      </div>

      {/* Draggable Overlay Box */}
      <motion.div
        className="relative z-10 w-[90%] max-w-[850px] h-[40%] max-h-[300px] bg-black/50 flex items-center justify-center flex-col rounded-lg cursor-grab"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.3}
        dragMomentum={false}
        whileDrag={{ cursor: "grabbing", scale: 1.02 }}
        animate={{ x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <div className="w-[95%] h-[90%] border-2 border-amber-200 flex items-center justify-center flex-col">
          <h1 className="font-extrabold text-6xl sm:text-8xl md:text-9xl lg:text-9xl font-mono py-2 text-white text-center">
            BRAINIUM
          </h1>
          <p className="font-medium text-md sm:text-lg md:text-3xl lg:text-3xl text-white text-center">
            Adding magic at its extreme
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default BoxComponent;
