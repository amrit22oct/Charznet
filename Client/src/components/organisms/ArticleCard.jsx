import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Loader from "../atoms/Loader";
import "../organisms/ArticleCard.css";
import { ThemeContextObject } from "../../context/ThemeContext";

const ArticleCard = ({
  article,
  showImage = true,
  showSummary = true,
  className = "",
}) => {
  const { theme } = useContext(ThemeContextObject);

  if (!article) return <Loader />;

  const { id, image, title, summary, author, date } = article;

  // Theme-based styles
  const cardBg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const contentBg = theme === "dark" ? "bg-gray-800" : "bg-white"; // ✅ content background
  const titleColor =
    theme === "dark"
      ? "text-gray-100 hover:text-blue-400"
      : "text-gray-900 hover:text-blue-600";
  const summaryColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const overlayInitial = theme === "dark" ? "bg-black/50" : "bg-black/30";
  const overlayHover = theme === "dark" ? "hover:opacity-20" : "hover:opacity-10";

  return (
    <article
      id="card"
      className={`w-[350px] h-[600px] shadow-lg m-6 overflow-hidden transition-colors duration-500 ${cardBg} ${className}`}
    >
      {/* Image */}
      {showImage && image && (
        <Link
          to={`/articles/${id}`}
          className="relative block h-60 overflow-hidden group"
        >
          <img
            src={image}
            alt={title || "Article image"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div
            className={`absolute inset-0 ${overlayInitial} opacity-100 transition-all duration-500 ${overlayHover}`}
          />
        </Link>
      )}

      {/* Content */}
      <div
        className={`p-5 flex flex-col h-[calc(600px-15rem)] transition-colors duration-500 ${contentBg}`}
      >
        <Link to={`/articles/${id}`}>
          <h3 className={`font-bold text-xl md:text-2xl ${titleColor}`}>
            {title || "Untitled Article"}
          </h3>
        </Link>

        {showSummary && summary && (
          <p
            className={`mt-3 flex-1 overflow-hidden article-summary ${summaryColor}`}
          >
            {summary}
          </p>
        )}

        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
          <span>{author || "Unknown Author"}</span>
          <time dateTime={date}>{date || "No date"}</time>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
