import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navlinks from "../atoms/Navlinks";
import { navLinks } from "../../constants/navlinks";

const MotionLink = motion(Link);

const Navbar = () => {
  return (
    <nav className="hidden xl:flex items-center justify-center w-full h-20 px-6 md:px-12 shadow-lg bg-gradient-to-r from-blue-50 via-white to-blue-50 sticky top-14 z-50 rounded-b-2xl">
      <Navlinks
        links={navLinks}
        as={MotionLink}
        className="flex flex-wrap justify-center gap-6 md:gap-10"
        linkClassName="relative text-gray-800 font-semibold text-lg transition-colors duration-300 hover:text-indigo-600 hover:after:w-full after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-indigo-600 after:w-0 after:transition-all after:duration-300"
      />
    </nav>
  );
};

export default Navbar;
