import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ mobile = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const width = mobile ? "w-[180px]" : "w-[220px]";
  const height = mobile ? "h-[34px]" : "h-[36px]";
  const buttonSize = mobile ? "w-[34px] h-[34px]" : "w-[36px] h-[36px]";

  return (
    <div ref={ref}>
      {!open ? (
        <FaSearch className="text-gray-600 cursor-pointer w-[22px] h-[22px]" onClick={() => setOpen(true)} />
      ) : (
        <div className={`flex items-center border rounded-full overflow-hidden transition-all duration-200 ${width} ${height}`}>
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            onBlur={() => setOpen(false)}
            className="flex-1 px-3 text-sm focus:outline-none"
          />
          <button className={`${buttonSize} flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 transition rounded-[30px]`}>
            <FaSearch className="text-black w-[18px] h-[18px]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
