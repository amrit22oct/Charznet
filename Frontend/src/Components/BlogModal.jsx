import React, { useState, useEffect, useRef } from "react";
import { FaHeart, FaRegComment, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfilePic from "../components/ProfilePic";
import ShareDropdown from "./ShareDropdown";
import API from "../api";
import { getImageUrl } from "../utils/getImageUrl";

const fadeInUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const DEFAULT_IMAGE = "https://placehold.co/600x400?text=No+Image+available";

const BlogModal = ({ id, slug, title, content, author, image, authorImage }) => {
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  const shareButtonRef = useRef(null);

  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const blogUrl = slug
    ? `${window.location.origin}/blogs/${slug}`
    : `${window.location.origin}/blogs/${id}`;

  const handleReadMore = () => {
    if (slug) navigate(`/blogs/${slug}`);
    else if (id) navigate(`/blogs/${id}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blogUrl);
      alert("✅ Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  // Fetch likes & comments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await API.get(`/blogs/${id}`);
        setLikesCount(blogRes.data.likes?.length || 0);
        setLiked(blogRes.data.likes?.includes(localStorage.getItem("userId")));

        const commentsRes = await API.get(`/blogs/${id}/comments`);
        setCommentsCount(commentsRes.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!localStorage.getItem("token")) return alert("Please log in to like!");
    
    // Optimistic UI
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      const res = await API.post(`/blogs/${id}/like`);
      setLikesCount(res.data.likes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
      // revert on error
      setLiked(liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
    }
  };

  return (
    <motion.div
      className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full relative"
      initial="hidden"
      whileInView="visible"
      whileHover={{ scale: 1.02 }}
      variants={fadeInUp}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="w-full flex-1 overflow-hidden">
        <img
          src={getImageUrl(image) || DEFAULT_IMAGE}
          alt={title || "blog thumbnail"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
        />
      </div>

      <div className="flex flex-col p-4 max-h-[500px]">
        <div className="flex items-center justify-between mb-2 relative">
          <div className="flex items-center gap-3">
            <ProfilePic src={authorImage} name={author || "Unknown Author"} size="sm" />
            <div>
              <span className="block text-sm font-semibold text-gray-800">{author || "Unknown Author"}</span>
              <p className="text-xs text-gray-500 flex gap-2">
                <span>{new Date().toLocaleDateString()}</span> • <span>5 mins read</span>
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              ref={shareButtonRef}
              onClick={() => setShareOpen(!shareOpen)}
              className="p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-600"
            >
              <FaShareAlt className="w-4 h-4" />
            </button>
            {shareOpen && (
              <ShareDropdown
                anchorRef={shareButtonRef}
                url={blogUrl}
                title={title}
                onCopy={handleCopy}
                onClose={() => setShareOpen(false)}
              />
            )}
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>

        <div
          className="text-sm text-gray-600 leading-relaxed line-clamp-4 mb-4 prose"
          dangerouslySetInnerHTML={{ __html: content || "" }}
        />

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1  cursor-pointer transition ${liked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
            >
              <FaHeart className="w-4 h-4" />
              <span className="text-xs">{likesCount}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
              <FaRegComment className="w-4 h-4" />
              <span className="text-xs">{commentsCount}</span>
            </button>
          </div>
          <button
            onClick={handleReadMore}
            className="text-xs font-medium text-indigo-600  cursor-pointer hover:underline"
          >
            Read More
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogModal;
