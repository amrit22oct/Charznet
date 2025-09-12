import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const ArticleDetail = () => {
  const { id } = useParams(); // get article id from URL
  const navigate = useNavigate(); // for going back
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        setError("Article not found");
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const getImageSrc = (src) => (src && src.trim() ? src : DEFAULT_IMAGE);
  const handleImageError = (e) => {
    e.currentTarget.src = DEFAULT_IMAGE;
  };
  const getImageClass = (src) =>
    getImageSrc(src) === DEFAULT_IMAGE
      ? "object-contain bg-black"
      : "object-cover";

  if (loading) return <p className="text-center py-10">Loading article...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        {article?.title || "Untitled"}
      </h1>

      <p className="text-gray-500 text-sm mt-2">
        By {article?.author?.name || "Unknown"} •{" "}
        {article?.createdAt
          ? new Date(article.createdAt).toLocaleDateString()
          : ""}
      </p>

      <img
        src={getImageSrc(article?.image)}
        alt={article?.title || "No Image"}
        onError={handleImageError}
        className={`w-full h-[400px] rounded-xl my-6 ${getImageClass(
          article?.image
        )}`}
      />

      <div className="prose max-w-none">
        {article?.content ? (
          <p>{article.content}</p>
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {article?.tags?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700">Tags:</h3>
          <div className="flex gap-2 flex-wrap mt-2">
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-200 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
