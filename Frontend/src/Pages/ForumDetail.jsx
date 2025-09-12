import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

// ProfilePic component
const ProfilePic = ({ src, name, size = "sm" }) => {
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-600 font-semibold">{name?.[0]?.toUpperCase() || "U"}</span>
      )}
    </div>
  );
};

const ForumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [author, setAuthor] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(3);

  // Fetch thread and replies
  const fetchThread = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/threads/${id}`);
      const threadData = res.data.thread || res.data;
      if (!threadData) throw new Error("Thread not found");

      setThread(threadData);
      setAuthor(threadData.author || { name: "Unknown", avatar: "" });
      // Reverse replies so most recent show first
      setReplies((threadData.replies || []).slice().reverse());
    } catch (err) {
      console.error(err);
      setError("Thread not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  // Post a reply
  const handlePostReply = async () => {
    if (!newReply.trim()) return;
    setPosting(true);
    try {
      await API.post(`/threads/${id}/replies`, { text: newReply.trim() });
      setNewReply("");
      fetchThread(); // refetch to get latest replies with author info
      setVisibleReplies(3); // reset visible replies
    } catch (err) {
      console.error(err);
      alert("Failed to post reply");
    } finally {
      setPosting(false);
    }
  };

  // Load more replies
  const handleViewMore = () => {
    setVisibleReplies((prev) => prev + 3);
  };

  if (loading) return <p className="text-center py-10">Loading thread...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!thread) return null;

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back
      </button>

      {/* Thread + Replies Card */}
      <div className="bg-white rounded-xl shadow-md border p-6 flex flex-col gap-6">
        {/* Thread content */}
        <div className="flex gap-3 items-center">
          <ProfilePic src={author?.avatar} name={author?.name} size="lg" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{thread.title}</h2>
            <p className="text-xs text-gray-500 mt-1">
              Created by: {author?.name || "Unknown"} | Last updated:{" "}
              {new Date(thread.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-gray-700 mt-4">{thread.content}</p>

        {/* Tags */}
        {thread.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-4">
            {thread.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-200 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Replies section */}
        <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col gap-4">
          <h3 className="font-semibold text-gray-700">Replies</h3>

          {/* Display replies */}
          <div className="flex flex-col gap-3 mt-4">
            {replies.length === 0 && <p className="text-gray-400 text-sm">No replies yet.</p>}

            {replies.slice(0, visibleReplies).map((reply) => (
              <div
                key={reply._id}
                className="flex gap-3 items-start p-3 rounded-lg border bg-gray-50"
              >
                <ProfilePic src={reply.author?.avatar} name={reply.author?.name} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600">
                    {reply.author?.name || "Anonymous"}
                  </p>
                  <p className="text-gray-700 text-sm">{reply.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(reply.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

            {/* View more button */}
            {visibleReplies < replies.length && (
              <button
                onClick={handleViewMore}
                className="text-blue-600 hover:underline text-sm mt-2 self-start"
              >
                View More
              </button>
            )}
          </div>

          {/* Reply input */}
          <div className="flex gap-2 mt-4">
            <input
              type="text"
              placeholder="Write a reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-2"
            />
            <button
              onClick={handlePostReply}
              disabled={posting || !newReply.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;
