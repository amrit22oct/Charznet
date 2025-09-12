import React from "react";

// Props definition
// - src: string | undefined (profile image URL)
// - name: string (user's full name, used for initials)
// - size: "sm" | "md" | "lg" | number (preset or custom size)
// - className: string (extra styles)

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
};

export default function ProfilePic({ src, name = "?", size = "md", className = "" }) {
  // Generate initials from name
  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const words = fullName.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Applied size
  const appliedSize = typeof size === "string" ? sizeMap[size] || sizeMap.md : "";

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-300 text-white font-semibold overflow-hidden ${appliedSize} ${className}`}
      style={typeof size === "number" ? { width: size, height: size, fontSize: size / 3 } : {}}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

