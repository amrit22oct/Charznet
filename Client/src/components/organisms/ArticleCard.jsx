import React from "react";
import { Link } from "react-router-dom";
import Loader from "../atoms/Loader";
import "../organisms/ArticleCard.css";

const ArticleCard = ({
  article,
  showImage = true,
  showSummary = true,
  className = "",
}) => {
  if (!article) return <Loader />;

  const { id, image, title, summary, author, date } = article;

  return (
    <article
      id="card"
      className={`w-[350px] h-[600px]  bg-white shadow-lg m-6 overflow-hidden  ${className}`}
    >
      {/* Image */}
      {showImage && image && (
        <Link
          to={`/articles/${id}`}
          className="relative block h-60 overflow-hidden"
        >
          <img
            src={image}
            alt={title || "Article image"}
            className="w-full h-full object-cover" // no hover scale
          />
          <div className="absolute inset-0 bg-black/30 opacity-100 hover:scale-105 hover:opacity-10 transition-opacity duration-500" />
        </Link>
      )}

      {/* Content */}
      <div className="p-5 flex flex-col h-[calc(600px-15rem)]">
        <Link to={`/articles/${id}`}>
          <h3 className="font-bold text-xl md:text-2xl text-gray-900 hover:text-blue-600 transition-colors">
            {title || "Untitled Article"}
          </h3>
        </Link>

        {showSummary && summary && (
  <p className="text-gray-700 text-sm  mt-3 flex-1 overflow-hidden article-summary">
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
