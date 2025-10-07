import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-gray-700 text-center py-4 shadow-inner z-100">
      &copy; {new Date().getFullYear()} My Website. All rights reserved.
    </footer>
  );
};

export default Footer;
