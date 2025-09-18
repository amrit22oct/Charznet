import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import ProfilePic from "./ProfilePic.jsx";

const HeartIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347.3 41.5 316.2 53.9 295.7 82.7L256 148.1 216.3 82.7c-20.5-28.7-51.6-41.1-82.9-35.8C50.5 65.1 0 124.7 0 190.2v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
  </svg>
);

const CommentIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
    <path d="M123.6 391.3c12.9-9.4 29.6-11.7 44.6-6.4c26.9 9.6 56.6 10.1 82.9 2.3s52.4-19.4 74.2-36.6c14.5-11.2 28.5-22.8 43-34.7c7.4-6.2 14.9-12.4 22.4-18.7c-3.1-3.3-6.2-6.5-9.4-9.8l-10.8-11.2c-3.3-3.4-6.7-6.8-10.2-10.1c-15-14.7-29.9-29.6-45-44.4c-8-7.9-16-15.8-24.1-23.8c-2.3-2.3-4.6-4.6-6.9-6.9c-1.5-1.5-3.1-2.9-4.6-4.4c-6.8-6.6-14.1-12.5-21.6-18.1c-1.8-1.4-3.5-2.8-5.3-4.2c-15.6-11.5-31.9-21.2-48.5-30.2c-6.6-3.6-13.3-7.1-20.1-10.4c-20.8-10-42.3-17.5-64-22.5c-44.6-10.3-89.2-2.3-132.8 22.9C3.1 161.7-1.1 176.4 .2 191.2c1.3 14.8 7.3 28.9 17.6 40.5c11.5 12.8 25 24.3 39.8 34.6c20.3 14.4 42.1 27 64.9 38.3c1.7 .9 3.4 1.8 5.1 2.7l.9 .5c.6 .3 1.1 .6 1.7 .9zM448 96a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm-64 160a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm-96-96a32 32 0 1 0 0 64 32 32 0 1 0 0-64z" />
  </svg>
);

const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
    <path d="M288 32c-80.8 0-160.7 32.7-218.6 89.2C1.5 183.5-3.4 250 2.2 308.5c5.7 58.5 28.6 112.9 66.8 159.2C130.3 502.5 204.4 512 288 512s157.7-9.5 219.1-51.5c38.2-46.3 61.1-100.7 66.8-159.2c5.6-58.5 .7-125-54.8-187.3C448.7 64.7 368.8 32 288 32zm160 192a160 160 0 1 1-320 0 160 160 0 1 1 320 0z" />
  </svg>
);

const ForumPost = ({ thread, author }) => {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await API.get(`/threads/${thread._id}`);
        const repliesData = res.data.replies || [];
        setReplies(repliesData);
      } catch (err) {
        console.error("Failed to fetch replies", err);
      }
    };
    if (thread?._id) fetchReplies();
  }, [thread]);

  return (
    <div className="flex flex-col justify-between w-full h-full text-gray-800 rounded-xl p-6 shadow-sm">
  {/* Top: Thread header and content */}
  <div>
    <div className="flex items-start gap-4 mb-4">
      <ProfilePic src={author?.avatar} name={author?.name} size="lg" rounded/>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-start gap-2">
          <p className="font-semibold text-lg leading-snug break-words">{thread.title}</p>
          <span className="flex items-center gap-1 text-gray-400 text-sm cursor-pointer hover:text-red-400">
            <HeartIcon className="w-4 h-4" /> {thread.likes || 0}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-3">{thread.content}</p>
      </div>
    </div>

    {/* Replies preview: show max 2 */}
    <div className="space-y-2">
      {replies.length === 0 && <p className="text-gray-400 text-sm">No replies yet.</p>}
      {replies.slice(0, 2).map((reply) => (
        <div key={reply._id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
          <ProfilePic src={reply.author?.avatar} name={reply.author?.name} size="sm" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-700">{reply.author?.name || "Anonymous"}</span>
            <p className="text-sm text-gray-500 break-words">{reply.text}</p>
          </div>
        </div>
      ))}

      {/* Show link if there are more than 2 replies */}
      {replies.length > 2 && (
        <Link
          to={`/forum/${thread._id}`}
          className="text-blue-500 text-sm hover:underline"
        >
          View all replies →
        </Link>
      )}
    </div>
  </div>

  {/* Footer */}
  <div className="flex justify-between items-center bg-gray-100 text-gray-400 text-xs border border-gray-300 p-2 rounded-md mt-4">
    <span>Created by: <span className="font-medium text-gray-600">{author?.name || "Unknown"}</span></span>
    <span>Last updated: {new Date(thread.updatedAt).toLocaleString()}</span>
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1"><CommentIcon className="w-3 h-3 text-green-500" /> {replies.length}</span>
      <span className="flex items-center gap-1"><EyeIcon className="w-3 h-3 text-yellow-500" /> {thread.views || 0}</span>
    </div>
  </div>
</div>

  );
};

export default ForumPost;
