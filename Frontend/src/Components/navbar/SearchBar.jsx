import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // import useNavigate
import Api from "../../api"; // your existing Api utility

const SearchBar = ({ mobile = false, type = "all" }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate(); // initialize navigate

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (searchText) => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }
  
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await Api.get("/search", {
        params: { q: trimmed, type, limit: 20 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data.results || []);
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      setResults([]);
    }
    setLoading(false);
  };

  // Debounce search
  useEffect(() => {
    const debounce = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const width = mobile ? "w-[180px]" : "w-[220px]";
  const height = mobile ? "h-[34px]" : "h-[36px]";
  const buttonSize = mobile ? "w-[34px] h-[34px]" : "w-[36px] h-[36px]";

  // Function to handle click on a search result
  const handleResultClick = (item) => {
    setOpen(false);
    setQuery("");
    setResults([]);

    // Navigate based on type
    switch(item._type) {
      case "blog":
        navigate(`/blogs/${item._id}`); // example blog page
        break;
      case "article":
        navigate(`/articles/${item.slug || item._id}`); // use slug if exists
        break;
      case "forum":
        navigate(`/forum/${item._id}`);
        break;
      default:
        console.warn("Unknown type:", item._type);
    }
  };

  return (
    <div ref={ref} className="relative">
      {!open ? (
        <FaSearch
          className="text-gray-600 cursor-pointer w-[22px] h-[22px]"
          onClick={() => setOpen(true)}
        />
      ) : (
        <div className={`flex items-center border rounded-full overflow-hidden transition-all duration-200 ${width} ${height}`}>
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-3 text-sm focus:outline-none"
          />
          <button className={`${buttonSize} flex items-center justify-center bg-[#FFD700] hover:bg-yellow-400 transition rounded-[30px]`}>
            <FaSearch className="text-black w-[18px] h-[18px]" />
          </button>
        </div>
      )}

      {/* Search Results Dropdown */}
      {open && results.length > 0 && (
        <div className={`absolute top-[calc(${height}+4px)] left-0 ${width} bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50`}>
          {results.map((item) => (
            <div
              key={item._id}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
              onClick={() => handleResultClick(item)}
            >
              <div>
                <p className="font-medium">{item.title || item.name || item.email}</p>
                <p className="text-gray-500 text-xs">{item._type}</p>
              </div>
            </div>
          ))}
          {loading && <div className="px-3 py-2 text-gray-500 text-sm">Loading...</div>}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
