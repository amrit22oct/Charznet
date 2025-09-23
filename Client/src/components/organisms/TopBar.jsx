import React from "react";
import { Link } from "react-router-dom";
import Logo from "../atoms/Logo";
import Hamburger from "../molecules/Hamburger";
import { navLinks } from "../../constants/navlinks";

const TopBar = () => {
  return (
    <nav className="flex items-center justify-between w-full h-14 px-4 sm:px-6 md:px-10 py-2 shadow-md bg-gray-400 sticky top-0 z-50">
      {/* Left: Logo */}
      <Link to="/" className="inline-flex">
        <Logo />
      </Link>

      {/* Right: Text (hidden on md and lg, visible on xl) */}
      <div className="hidden xl:block text-lg sm:text-xl md:text-2xl font-bold text-gray-800 select-none text-right truncate">
        Lets Explore
      </div>

      {/* Hamburger Menu visible on small to large screens */}
      <div className="xl:hidden">
        <Hamburger links={navLinks} />
      </div>
    </nav>
  );
};

export default TopBar;
