import React from "react";
import { motion, useTransform, useSpring, useScroll } from "framer-motion";
import CardComponent from "../../components/organisms/CardComponent";
import HorizontalCarousel from "./HorizontalCarousel";

const PopularCardsCarousel = () => {
  const { scrollY } = useScroll();
  const headerHeight = 64;
  const carouselHeight = 400;

  const totalSectionHeight = headerHeight + carouselHeight;
  const scrollYClamped = useTransform(scrollY, [0, totalSectionHeight], [0, totalSectionHeight]);

  const headerYRange = useTransform(scrollYClamped, [0, carouselHeight], [0, carouselHeight]);
  const headerYSmooth = useSpring(headerYRange, { stiffness: 90, damping: 25 });

  const carouselOpacityRange = useTransform(scrollYClamped, [0, carouselHeight], [0, 1]);
  const carouselOpacitySmooth = useSpring(carouselOpacityRange, { stiffness: 80, damping: 25 });

  const carouselScaleRange = useTransform(scrollYClamped, [0, 200], [0.97, 1]);
  const carouselScaleSmooth = useSpring(carouselScaleRange, { stiffness: 90, damping: 25 });

  return (
    <div className="relative w-full">
      {/* Header */}
      <motion.div
        style={{ y: headerYSmooth }}
        className="absolute top-0 w-full z-50"
      >
        <div className="h-16 bg-gray-200 flex items-center justify-center text-xl font-bold">
          <span className="overflow-hidden whitespace-nowrap border-r-2 border-black pr-2">
            Most Popular Cards
          </span>
        </div>
      </motion.div>

      {/* Carousel */}
      <motion.div
        style={{ opacity: carouselOpacitySmooth, scale: carouselScaleSmooth, top: 0 }}
        className="absolute left-0 w-full z-0"
      >
        <HorizontalCarousel>
          {[...Array(5)].map((_, i) => (
            <CardComponent key={i} index={i} />
          ))}
        </HorizontalCarousel>
      </motion.div>

      {/* Spacer */}
      <div style={{ height: `${headerHeight}px` }}></div>
    </div>
  );
};

export default PopularCardsCarousel;
