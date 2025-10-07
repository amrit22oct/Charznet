import React from "react";

/**
 * A reusable social links component.
 *
 * Props:
 * - title: string (heading text, e.g. "Follow Us On")
 * - highlight: string (highlighted part of heading, e.g. "Us")
 * - socials: array of objects [{ name, icon, link }]
 * - className: optional additional styling
 */

const SocialLinks = ({
  title = "Follow",
  highlight = "Us",
  socials = [
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
  ],
  className = "",
}) => {
  return (
    <div className={`mt-16 flex flex-col items-center space-y-6 ${className}`}>
      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
        {title} <span className="text-blue-600">{highlight}</span> On
      </h2>

      {/* Social Icons */}
      <div className="flex gap-6 sm:gap-8 flex-wrap justify-center">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden 
              flex items-center justify-center bg-white shadow-md hover:shadow-xl 
              transition-all duration-300 hover:scale-110"
          >
            <img
              src={social.icon}
              alt={social.name}
              className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300 rounded-full" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
