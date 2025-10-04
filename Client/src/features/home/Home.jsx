import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useTransform,
  useSpring,
  useScroll,
  useMotionValue,
} from "framer-motion";
import CardComponent from "../../components/organisms/CardComponent";
import ArticleList from "../../components/organisms/ArticleList";
import ArticleCard from "../../components/organisms/ArticleCard";
import ContentSection from "../../components/organisms/ContentSection";

const Home = () => {
  const { scrollY } = useScroll();
  const [isPaused, setIsPaused] = useState(false);
  const [x, setX] = useState(0); // carousel X position
  const carouselRef = useRef(null);
  const [totalWidth, setTotalWidth] = useState(0);

  // MotionValue to track max scroll (prevents moving back up)
  const maxScrollY = useMotionValue(0);
  useEffect(() => {
    return scrollY.onChange((value) => {
      if (value > maxScrollY.get()) {
        maxScrollY.set(value); // only update if scrolling down
      }
    });
  }, [scrollY, maxScrollY]);

  // Transform header Y based on maxScrollY
  const headerYRange = useTransform(maxScrollY, [100, 400], [0, 400]);
  const headerYSmooth = useSpring(headerYRange, { stiffness: 70, damping: 25 });

  // Carousel opacity and scale based on maxScrollY
  const carouselOpacityRange = useTransform(maxScrollY, [200, 450], [0, 1]);
  const carouselOpacitySmooth = useSpring(carouselOpacityRange, {
    stiffness: 70,
    damping: 25,
  });
  const carouselScaleRange = useTransform(maxScrollY, [200, 450], [0.97, 1]);
  const carouselScaleSmooth = useSpring(carouselScaleRange, {
    stiffness: 70,
    damping: 25,
  });

  // Calculate total width of one card set dynamically
  useEffect(() => {
    if (carouselRef.current) {
      const firstSet = carouselRef.current.querySelector(".card-set");
      if (firstSet) {
        setTotalWidth(firstSet.scrollWidth);
        setX(-firstSet.scrollWidth);
      }
    }
  }, []);

  // Animate X position continuously
  useEffect(() => {
    let animationFrame;
    const speed = 4;

    const animate = () => {
      if (!isPaused && totalWidth > 0) {
        setX((prev) => {
          let next = prev + speed;
          if (next >= 0) next -= totalWidth; // seamless loop
          return next;
        });
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, totalWidth]);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Carousel */}
      <div className="w-full h-[400px] absolute top-0 left-0 z-10 overflow-hidden">
        <motion.div
          ref={carouselRef}
          className="flex w-max"
          style={{
            x,
            opacity: carouselOpacitySmooth,
            scale: carouselScaleSmooth,
            pointerEvents: "auto",
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

      <motion.div style={{ y: headerYSmooth }} className="relative z-20">
        <div className="h-16 bg-gray-200 flex items-center justify-center text-xl font-bold shadow-md">
          <span className="overflow-hidden whitespace-nowrap border-r-2 border-black pr-2">
            Most Popular Cards
          </span>
        </div>

        <ContentSection />
        <div className=" bg-gray100 px-4 sm:px-8 lg:px-16 flex justify-center items-center">
          <h2 className="text-5xl  mt-10 font-bold mb-6">Latest Articles</h2>
         
        </div>
      </motion.div>

      
    </div>

  );
};

export default Home;
