import React, { useState, useEffect, useRef } from "react";
import { motion, useTransform, useSpring, useScroll } from "framer-motion";
import CardComponent from "../../components/organisms/CardComponent";

const PopularCardsCarousel = () => {
  const { scrollY } = useScroll();
  const [isPaused, setIsPaused] = useState(false);
  const [x, setX] = useState(0);
  const carouselRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);

  const headerHeight = 64; 
  const carouselHeight = 400;

  // Horizontal carousel setup
  useEffect(() => {
    if (carouselRef.current) {
      const firstSet = carouselRef.current.querySelector(".card-set");
      if (firstSet) {
        setTotalWidth(firstSet.scrollWidth);
        setX(-firstSet.scrollWidth);
      }
    }
  }, []);

  // Smooth horizontal animation
  useEffect(() => {
    let animationFrame;
    const speed = 4;
    const animate = () => {
      if (!isPaused && totalWidth > 0) {
        setX((prev) => {
          let next = prev + speed;
          if (next >= 0) next -= totalWidth;
          return next;
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, totalWidth]);

  // Header animation relative to scroll
  const totalSectionHeight = headerHeight + carouselHeight;
  const scrollYClamped = useTransform(scrollY, [0, totalSectionHeight], [0, totalSectionHeight]);
  const headerYRange = useTransform(scrollYClamped, [0, carouselHeight], [0, carouselHeight]);
  const headerYSmooth = useSpring(headerYRange, { stiffness: 90, damping: 25 });

  // Carousel fade and scale synchronized with header movement
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
      <div
        className="absolute left-0 w-full overflow-hidden z-0"
        style={{ height: `${carouselHeight}px` }}
      >
        <motion.div
          ref={carouselRef}
          className="flex w-max absolute"
          style={{
            x,
            opacity: carouselOpacitySmooth, // synced with header
            scale: carouselScaleSmooth,
            top: 0,
          }}
        >
          {[...Array(2)].map((_, setIndex) => (
            <div className="flex card-set" key={setIndex}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                >
                  <CardComponent index={i} />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Spacer for smooth scrolling */}
      <div style={{ height: `${headerHeight}px` }}></div>
    </div>
  );
};

export default PopularCardsCarousel;
