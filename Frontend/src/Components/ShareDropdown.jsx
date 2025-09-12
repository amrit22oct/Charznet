// ShareDropdown.jsx
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ShareDropdown = ({ anchorRef, url, title, onCopy, onClose, maxHeight = "15rem" }) => {
  const dropdownRef = useRef(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  // Calculate dropdown position relative to anchor
  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    }
  }, [anchorRef]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose && onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div
      ref={dropdownRef}
      className="absolute bg-white rounded-lg shadow-xl border border-gray-100 flex flex-col z-50 w-30 overflow-y-auto text-[12px] leading-tight"
      style={{ top: position.top, left: position.left, maxHeight }}
    >
      <a
        href={`https://wa.me/?text=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded hover:bg-gray-50 hover:text-green-600 transition"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded hover:bg-gray-50 hover:text-blue-500 transition"
      >
        Telegram
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded hover:bg-gray-50 hover:text-sky-500 transition"
      >
        Twitter
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 rounded hover:bg-gray-50 hover:text-blue-700 transition"
      >
        Facebook
      </a>
      <button
        onClick={onCopy}
        className="px-3 py-2 text-left rounded hover:bg-gray-50 hover:text-gray-700 transition"
      >
        Copy Link
      </button>
    </div>,
    document.body
  );
};

export default ShareDropdown;
