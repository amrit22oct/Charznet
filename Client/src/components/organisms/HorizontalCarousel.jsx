import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const HorizontalCarousel = ({ children, speed = 2 }) => {
  const carouselRef = useRef(null);
  const [x, setX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [totalWidth, setTotalWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const firstSet = carouselRef.current.querySelector(".carousel-set");
      if (firstSet) {
        setTotalWidth(firstSet.scrollWidth);
        setX(-firstSet.scrollWidth); // start off-screen
      }
    }
  }, []);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      if (!isPaused && totalWidth > 0) {
        setX((prev) => {
          let next = prev + speed;
          if (next >= 0) next -= totalWidth; // loop
          return next;
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, totalWidth, speed]);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        ref={carouselRef}
        className="flex w-max"
        style={{ x }}
      >
        {[...Array(2)].map((_, setIndex) => (
          <div className="flex carousel-set" key={setIndex}>
            {React.Children.map(children, (child, i) => (
              <div
                key={i}
                className="flex-shrink-0"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {child}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default HorizontalCarousel;
