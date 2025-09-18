import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { getImageUrl } from "../utils/getImageUrl";
import { FaHeart } from "react-icons/fa";

const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // Fetch blog
  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blogs/${id}`);
        setBlog(res.data);
        setLikesCount(res.data.likes?.length || 0);
        setLiked(res.data.likes?.includes(userId));
      } catch (err) {
        console.error(err);
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, userId]);

  // Fetch comments separately
  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await API.get(`/blogs/${id}/comments`);
        setComments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // Handle new comment
  const handleAddComment = async () => {
    if (!token) return alert("Please log in to comment!");
    if (!newComment.trim()) return;

    try {
      const res = await API.post(
        `/blogs/${id}/comments`,
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

  // Handle like with optimistic UI
  const handleLike = async () => {
    if (!token) return alert("Please log in to like!");

    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await API.post(`/blogs/${id}/like`);
      setLikesCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
      // revert
      setLiked(prevLiked);
      setLikesCount(prevLiked ? likesCount + 1 : likesCount - 1);
    }
  };

  if (loading) return <p className="text-center py-10">Loading blog...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline cursor-pointer mb-4"
      >
        ← Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4">{blog?.title}</h1>
      <p className="text-gray-500 text-sm mt-2">
        By {blog?.author?.name || "Unknown"} • {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString() : ""}
      </p>

      {blog?.summary && <p className="mt-4 text-gray-700 italic">{blog.summary}</p>}

      <img
        src={getImageUrl(blog?.image)}
        alt={blog?.title || "No Image"}
        onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
        className="w-full max-h-[600px] rounded-xl my-6 object-contain bg-black"
      />

      {/* Like button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 cursor-pointer py-2 rounded-lg ${
            liked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaHeart /> {likesCount}
        </button>
      </div>

      {/* Blog content */}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog?.content || "" }} />

      {/* Comments */}
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

export default BlogDetail;
