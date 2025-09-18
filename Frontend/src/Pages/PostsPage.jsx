import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import CreateBlogPost from "../Components/CreateBlogPost";
import CreateForumPost from "../Components/CreateForumPost";
import Api from "../api";

const PostsPage = () => {
  const { type, id } = useParams(); // type = "blogs" | "forum"
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(type || "blogs");
  const [editData, setEditData] = useState(null);

  // sync activeTab when creating
  useEffect(() => {
    if (!id && type) setActiveTab(type);
  }, [type, id]);

  // fetch data if editing
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint = type === "blogs" ? `/blogs/${id}` : `/threads/${id}`;

        const res = await Api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditData(res.data);
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };

    fetchData();
  }, [id, type]);

  const handleCancel = () => navigate(-1);

  // decide which form to render
  const currentForm = id ? type : activeTab;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        {id
          ? `Edit ${currentForm === "blogs" ? "Blog" : "Forum Post"}`
          : "Create Posts"}
      </h1>

      {/* Tabs for creating only */}
      {!id && (
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              activeTab === "blogs"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => navigate("/create-posts/blogs")}
          >
            Blog
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition ${
              activeTab === "forum"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => navigate("/create-posts/forum")}
          >
            Forum
          </button>
        </div>
      )}

      <div className="bg-white rounded-b-lg shadow-md p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {currentForm === "blogs" ? (
            <motion.div
              key="blogs"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CreateBlogPost editData={editData} onCancel={handleCancel} />
            </motion.div>
          ) : (
            <motion.div
              key="forum"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CreateForumPost editData={editData} onCancel={handleCancel} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostsPage;
