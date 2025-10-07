import React from "react";
import BrandCarousel from "./BrandCarousel";
import SocialLinks from "../molecules/SocialLinks"; // 👈 Import the reusable component

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 text-center py-8 shadow-inner z-50">
      {/* Brand carousel section */}
      <BrandCarousel />

      {/* Social Links section */}
      <SocialLinks
        title="Follow"
        highlight="Us"
        socials={[
          {
            name: "Instagram",
            icon: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
            link: "https://www.instagram.com/",
          },
          {
            name: "Twitter",
            icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png",
            link: "https://twitter.com/",
          },
          {
            name: "LinkedIn",
            icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png",
            link: "https://www.linkedin.com/",
          },
          {
            name: "YouTube",
            icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
            link: "https://www.youtube.com/",
          },
        ]}
        className="mt-8"
      />

      {/* Footer text */}
      <div className="mt-6 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} My Website. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
