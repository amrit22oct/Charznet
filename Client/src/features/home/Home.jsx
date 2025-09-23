import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CardComponent from "../../components/organisms/CardComponent"; // import the new Card component

const Home = () => {
  const { scrollY } = useScroll();

  // Slow down scroll effect
  const slowScroll = useTransform(scrollY, (value) => value * 0.95);

  // Smooth header/content movement
  const headerYRange = useTransform(slowScroll, [100, 400], [0, 400]);
  const headerYSmooth = useSpring(headerYRange, { stiffness: 70, damping: 25 });

  // Smooth carousel opacity and scale
  const carouselOpacityRange = useTransform(slowScroll, [200, 450], [0, 1]);
  const carouselOpacitySmooth = useSpring(carouselOpacityRange, {
    stiffness: 70,
    damping: 25,
  });

  const carouselScaleRange = useTransform(slowScroll, [200, 450], [0.97, 1]);
  const carouselScaleSmooth = useSpring(carouselScaleRange, {
    stiffness: 70,
    damping: 25,
  });

  const colors = ["red", "green", "blue", "purple"];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Carousel */}
      <motion.div
        className="w-full h-[400px] flex items-center justify-center absolute top-0 left-0 z-10"
        style={{ opacity: carouselOpacitySmooth, scale: carouselScaleSmooth }}
      >
        {colors.map((color, idx) => (
          <CardComponent key={idx} color={color} index={idx} />
        ))}
      </motion.div>

      {/* Header + Content */}
      <motion.div style={{ y: headerYSmooth }} className="relative z-20">
        {/* Header */}
        <div className="h-16 bg-amber-50 flex items-center justify-center text-xl font-bold shadow-md rounded-b-lg opacity-200">
        <span className="overflow-hidden whitespace-nowrap border-r-2 border-black ">
            Most Popular Cards
          </span>


        </div>

        {/* Content below */}
        <div>
          <div className="h-[1200px] bg-gray-400 flex justify-center items-center rounded-lg shadow-inner p-4">
            <p className="text-gray-800 text-lg">main contents of the page</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
