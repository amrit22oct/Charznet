import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreateBlogPost from "../Components/CreateBlogPost";
import CreateForumPost from "../Components/CreateForumPost";

const PostsPage = () => {
  const [activeTab, setActiveTab] = useState("blog"); // "blog" or "forum"

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Create Posts</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "blog"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("blog")}
        >
          Blog
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "forum"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("forum")}
        >
          Forum
        </button>
      </div>

      {/* Tab Content with Slide Animation */}
      <div className="bg-white rounded-b-lg shadow-md p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === "blog" ? (
            <motion.div
              key="blog"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CreateBlogPost />
            </motion.div>
          ) : (
            <motion.div
              key="forum"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CreateForumPost />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostsPage;
