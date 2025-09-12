import React, { useState } from "react";
import Logo from "./navbar/Logo";
import NavLinks from "./navbar/NavLinks";
import SearchBar from "./navbar/SearchBar";
import AuthMenu from "./navbar/AuthMenu";
import MobileMenu from "./navbar/MobileMenu";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [mobileMenu, setMobileMenu] = useState(false);

  const NAVBAR_HEIGHT = 64; // px

  return (
    <>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 w-full h-[64px] bg-white/95 backdrop-blur-md shadow-md flex items-center px-6 z-50 transition-colors"
        style={{ height: NAVBAR_HEIGHT }}
      >
        {/* Logo */}
        <Logo />

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 ml-10">
          <NavLinks />
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          <SearchBar />
          <AuthMenu user={user} />
        </div>

        {/* Mobile Section */}
        <div className="md:hidden flex items-center gap-4 ml-auto">
          <SearchBar mobile />
          <button
            className="text-2xl text-gray-700 hover:text-gray-900 transition"
            onClick={() => setMobileMenu((prev) => !prev)}
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
          <MobileMenu user={user} closeMenu={() => setMobileMenu(false)} />
        </div>
      )}

      {/* Push page content below navbar so it’s not hidden */}
      <div style={{ height: NAVBAR_HEIGHT }}></div>
    </>
  );
};

export default Navbar;
