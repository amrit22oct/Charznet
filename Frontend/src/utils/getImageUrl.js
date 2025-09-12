// src/utils/getImageUrl.js
import API from "../api";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image";

// Axios instance has a defaults.baseURL you can use
export const getImageUrl = (src) => {
  if (!src) return DEFAULT_IMAGE;

  // If already a full URL (like cloudinary or external), return it directly
  if (src.startsWith("http")) return src;

  // Otherwise, prepend your backend baseURL
  const baseURL = API.defaults.baseURL || "";
  return `${baseURL}${src}`;
};
