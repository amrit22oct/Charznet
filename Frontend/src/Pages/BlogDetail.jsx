import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { getImageUrl } from "../utils/getImageUrl";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error(err);
        setError("Blog not found");
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading blog...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        {blog?.title || "Untitled"}
      </h1>

      {/* Author + Date */}
      <p className="text-gray-500 text-sm mt-2">
        By {blog?.author?.name || "Unknown"} •{" "}
        {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
      </p>

      {/* Image */}
      <img
        src={getImageUrl(blog?.image)}
        alt={blog?.title || "No Image"}
        onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
        className="w-full max-h-[600px] rounded-xl my-6 object-contain bg-black"
      />

      {/* Content (render HTML from CKEditor) */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
      />

      {/* Tags */}
      {blog?.tags?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700">Tags:</h3>
          <div className="flex gap-2 flex-wrap mt-2">
            {blog.tags.map((tag, idx) => (
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

export default BlogDetail;
