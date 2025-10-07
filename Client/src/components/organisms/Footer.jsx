import React from "react";
import BrandCarousel from "./BrandCarousel";
import SocialLinks from "../molecules/SocialLinks"; // 👈 Import the reusable component

const Footer = () => {
  return (
    <footer className="w-full bg-gray-400 text-gray-700 shadow-inner z-50">
      {/* Brand carousel */}
      <div className="">
        <BrandCarousel />
      </div>

      {/* Links & description section */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
        {/* Column 1: About */}
        <div>
          <h3 className="text-lg font-semibold mb-3">About Us</h3>
          <p className="text-sm text-gray-600">
            We are a team dedicated to building modern web experiences that are fast, reliable, and user-friendly.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600">Home</a></li>
            <li><a href="#" className="hover:text-blue-600">About</a></li>
            <li><a href="#" className="hover:text-blue-600">Services</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-600">123 Main Street, City, Country</p>
          <p className="text-sm text-gray-600">Email: info@example.com</p>
          <p className="text-sm text-gray-600">Phone: +123 456 7890</p>
        </div>
      </div>

      {/* Social links */}
      <SocialLinks
        title="Follow"
        highlight="Us"
        socials={[
          { name: "Instagram", icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png", link: "https://www.instagram.com/" },
          { name: "Twitter", icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png", link: "https://twitter.com/" },
          { name: "LinkedIn", icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png", link: "https://www.linkedin.com/" },
          { name: "YouTube", icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png", link: "https://www.youtube.com/" },
        ]}
        className="mt-6"
      />

      {/* Footer bottom */}
      <div className="mt-6 py-4 text-sm text-gray-600 text-center border-t border-gray-200">
        &copy; {new Date().getFullYear()} My Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
