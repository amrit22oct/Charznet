import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navlinks from "../atoms/Navlinks";
import Logo from "../atoms/Logo";
import { navLinks } from "../../constants/navlinks";

// ✅ Updated: use motion.create() instead of motion()
const MotionLink = motion.create(Link);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;
      const rect = navbarRef.current.getBoundingClientRect();
      setScrolled(rect.top <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeSlide = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <nav
      ref={navbarRef}
      className="sticky top-0 z-50 w-full shadow-md bg-gray-50"
      style={{ height: "80px" }}
    >
      <div className="relative h-full px-6 md:px-12 flex items-center justify-center">
        {/* Center: Navlinks */}
        <div className="flex justify-center w-full">
          <Navlinks
            links={navLinks}
            as={MotionLink}
            className="flex flex-wrap justify-center gap-6 md:gap-10"
            linkClassName="relative text-gray-800 font-semibold text-lg transition-colors duration-300 hover:text-indigo-600 hover:after:w-full after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-indigo-600 after:w-0 after:transition-all after:duration-300"
          />
        </div>

        {/* Left: Logo */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="logo"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeSlide}
              transition={{ duration: 0.3 }}
              className="absolute left-6"
            >
              <Link to="/">
                <Logo />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right: Lets Explore */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              key="text"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeSlide}
              transition={{ duration: 0.3 }}
              className="absolute right-6 text-lg sm:text-xl md:text-2xl font-bold text-gray-800 select-none"
            >
              Lets Explore
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
