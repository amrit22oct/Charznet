import React, { useState } from "react";
import API from "../api";
import Button from "../Components/Buttons/Button";

const CreateForumPost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return setMessage("Title and content are required");
    setLoading(true);
    try {
      const res = await API.post("/threads", { title, content });
      setMessage("Forum thread created successfully!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to create forum thread");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Create Forum Thread</h2>
      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded w-full h-32"
        />
        <Button type="submit" styles="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Forum Thread"}
        </Button>
      </form>
    </div>
  );
};

export default CreateForumPost;
