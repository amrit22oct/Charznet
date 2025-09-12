import React from "react";

const NavLinks = ({ onClick }) => (
  <div className="flex flex-col md:flex-row gap-6 font-medium">
    <a href="/home" onClick={onClick} className="hover:text-gray-500">
      Home
    </a>
    <a href="/all-articles" onClick={onClick} className="hover:text-gray-500">
      News
    </a>
    <a href="/all-blogs" onClick={onClick} className="hover:text-gray-500">
      Blog
    </a>
    <a href="/all-forum" onClick={onClick} className="hover:text-gray-500">
      Forum
    </a>
  </div>
);

export default NavLinks;
