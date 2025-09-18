import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api"; // axios instance
import { FaHeart } from "react-icons/fa";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // Fetch article details
  useEffect(() => {
    if (!id) return;
  
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/articles/${id}`);
        const data = res.data;
        setArticle(data);
        setLikesCount(data.likes?.length || 0);
  
        // Correctly check if the user already liked
        if (userId) {
          setLiked(data.likes?.some(like => String(like) === String(userId)));
        } else {
          setLiked(false);
        }
      } catch (err) {
        console.error(err);
        setError("Article not found");
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchArticle();
  }, [id, userId]);
  

  // Fetch comments
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await API.get(`/articles/${id}/comments`);
        setComments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!token) return alert("Please log in to comment!");
    if (!newComment.trim()) return;

    try {
      const res = await API.post(
        `/articles/${id}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI with new comment
      setComments(prev => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  // Handle like
  const handleLike = async () => {
    if (!token) return alert("Please log in to like!");

    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await API.post(`/articles/${id}/like`);
      setLikesCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
      // revert
      setLiked(prevLiked);
      setLikesCount(prevLiked ? likesCount + 1 : likesCount - 1);
    }
  };
  

  const getImageSrc = (src) => (src && src.trim() ? src : DEFAULT_IMAGE);
  const handleImageError = (e) => { e.currentTarget.src = DEFAULT_IMAGE; };
  const getImageClass = (src) => getImageSrc(src) === DEFAULT_IMAGE ? "object-contain bg-black" : "object-cover";

  if (loading) return <p className="text-center py-10">Loading article...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline cursor-pointer mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        {article?.title || "Untitled"}
      </h1>

      <p className="text-gray-500 text-sm mt-2">
        By {article?.author?.name || "Unknown"} •{" "}
        {article?.createdAt ? new Date(article.createdAt).toLocaleDateString() : ""}
      </p>

      <img
        src={getImageSrc(article?.image)}
        alt={article?.title || "No Image"}
        onError={handleImageError}
        className={`w-full h-[400px] rounded-xl my-6 ${getImageClass(article?.image)}`}
      />

      {/* Like button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg ${
            liked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaHeart /> {likesCount}
        </button>
      </div>

      <div className="prose max-w-none">
        {article?.content ? <p>{article.content}</p> : <p>No content available.</p>}
      </div>

      {article?.tags?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700">Tags:</h3>
          <div className="flex gap-2 flex-wrap mt-2">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-200 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition"
          >
            Post
          </button>
        </div>

        {commentsLoading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c._id || c.id} className="border rounded-lg p-4">
                <p className="text-gray-800">{c.text}</p>
                <p className="text-gray-500 text-sm mt-1">
                  By {c.author?.name || c.author || "Unknown"} • {new Date(c.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
