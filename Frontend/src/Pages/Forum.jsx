import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ForumPost from "../Components/ForumPost";
import TopReads from "../Components/TopReads";
import TopAuthors from "../Components/TopAuthors";
import Button from "../Components/Buttons/Button";

const Forum = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await API.get("/threads");
        setThreads(res.data?.threads || []);
      } catch (err) {
        console.error("Failed to fetch threads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchThreads();
  }, []);

  const topReads = [...threads]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 4);

  const authorCounts = threads.reduce((acc, t) => {
    if (t.author?.name) acc[t.author.name] = (acc[t.author.name] || 0) + 1;
    return acc;
  }, {});
  const topAuthors = Object.entries(authorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // ✅ Limit to max 3 posts
  const visibleThreads = threads.slice(0, 3);

  // 🔹 Skeleton loaders
  const SkeletonPost = () => (
    <div className="shadow-lg rounded-2xl bg-white p-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  const SkeletonSidebar = () => (
    <div className="shadow-lg rounded-2xl bg-white p-4 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );

  return (
    <section className="max-w-[1240px] mx-auto px-4 md:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-0">
          Forum
        </h1>
        <Button onClick={() => navigate("/all-forum")}>
          View all {">>"}
        </Button>
      </div>

      <p className="text-gray-600 mb-8 text-sm md:text-base">
        Welcome to the forum! Here you can ask questions, share tips, and learn
        from top contributors.
      </p>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Posts */}
        <div
          className="flex flex-col gap-6 flex-[2] min-w-0"
          style={{ maxHeight: "900px" }}
        >
          {loading ? (
            <>
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </>
          ) : visibleThreads.length > 0 ? (
            visibleThreads.map((thread) => (
              <div
                key={thread._id}
                className="shadow-lg rounded-2xl hover:shadow-xl transition bg-white w-full flex-1"
              >
                <ForumPost
                  thread={thread}
                  author={thread.author || { name: "Unknown" }}
                />
              </div>
            ))
          ) : (
            <p>No threads available.</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8 flex-1 min-w-0">
          {loading ? (
            <>
              <SkeletonSidebar />
              <SkeletonSidebar />
            </>
          ) : (
            <>
              <TopReads topReads={topReads} />
              <TopAuthors topAuthors={topAuthors} />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Forum;
