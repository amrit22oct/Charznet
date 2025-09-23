import React from "react";
import Icon from "../atoms/Icon"; // Assuming your Icon component is ready

const ContactBar = () => {
  return (
    <div className="hidden sm:flex flex-wrap items-center justify-between bg-gray-500 h-13 w-full px-8">
      
      {/* Left: Contact Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <h3 className="text-lg font-medium text-black p-2">Let's role</h3>
        <h3 className="text-lg font-medium text-black p-2">+91 1998564925</h3>
      </div>

      {/* Center: Icons */}
      <div className="flex items-center gap-4 my-2 sm:my-0">
        <Icon />
      </div>

      {/* Right: Search */}
      <div className="flex-shrink-0">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-1 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-[aqua]"
        />
      </div>
      
    </div>
  );
};

export default ContactBar;
