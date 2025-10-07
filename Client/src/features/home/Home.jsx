import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import PopularCardsCarousel from "../../components/organisms/PopularCardsCarousel";
import ContentSection from "../../components/organisms/ContentSection";
import ArticleContentSection from "../../components/organisms/ArticleContentSection/ArticleContentSection";
import HorizontalCarousel from "../../components/organisms/HorizontalCarousel";
import CardComponent from "../../components/organisms/CardComponent";
import BrandCarousel from "../../components/organisms/BrandCarousel";

const Home = () => {
  const { scrollY } = useScroll();
  const headerHeight = 64;
  const carouselHeight = 400;
  const totalSectionHeight = headerHeight + carouselHeight;

  // Clamp scrollY for header animation
  const scrollYClamped = useTransform(
    scrollY,
    [0, totalSectionHeight],
    [0, totalSectionHeight]
  );
  const headerYRange = useTransform(
    scrollYClamped,
    [0, carouselHeight],
    [0, carouselHeight]
  );
  const headerYSmooth = useSpring(headerYRange, { stiffness: 90, damping: 25 });

  return (
    <div className="relative bg-gray-50">
      {/* Most Popular Carousel */}
      <div className="w-full relative">
        <PopularCardsCarousel />
      </div>

      {/* All sections below header move with it */}
      <motion.div style={{ y: headerYSmooth }} className="relative z-10">
        {/* Main Content Section */}
        <ContentSection />

        {/* Latest Articles Section */}
        <div className="bg-gray-100 px-4 sm:px-8 lg:px-16 flex justify-center items-center flex-col">
          <h2 className="text-5xl mt-10 font-bold mb-6">Latest Articles</h2>
          <ArticleContentSection />
        </div>

        
      </motion.div>

      {/* Spacer for smooth scrolling */}

      
      <div
        style={{ height: `${headerHeight + carouselHeight}px` }}
        className="bg-gray-100"
      />
      <BrandCarousel />






    </div>
  );
};

export default Home;
