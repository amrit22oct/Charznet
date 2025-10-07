// BrandCarousel.jsx
import React from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import Logo from "../atoms/Logo"; // your Brainium text logo

const BrandCarousel = ({ speed = 1.5 }) => {
  const x = useMotionValue(0);
  const containerRef = React.useRef(null);
  const [totalWidth, setTotalWidth] = React.useState(0);

  React.useEffect(() => {
    if (containerRef.current) {
      const firstSet = containerRef.current.querySelector(".carousel-set");
      if (firstSet) {
        setTotalWidth(firstSet.scrollWidth);
        x.set(-firstSet.scrollWidth); // start off-screen
      }
    }
  }, [x]);

  useAnimationFrame(() => {
    if (totalWidth > 0) {
      let next = x.get() + speed;
      if (next >= 0) next -= totalWidth; // infinite loop
      x.set(next);
    }
  });

  return (
    <div className="relative w-full overflow-hidden  bg-gray-50 shadow-lg">
      <motion.div ref={containerRef} className="flex w-max" style={{ x }}>
        {[...Array(2)].map((_, setIndex) => (
          <div className="flex carousel-set" key={setIndex}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-64 h-30 sm:w-72 sm:h-56 md:w-96 md:h-64 flex items-center justify-center p-4"
              >
                <Logo />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrandCarousel;
