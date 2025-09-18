import React, { useState, useEffect } from "react";
import API from "../api";
import Button from "../Components/Buttons/Button";

const CreateForumPost = ({ editData, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Prefill if editing
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setContent(editData.content || "");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return setMessage("⚠️ Title and content are required");

    setLoading(true);
    try {
      if (editData?._id) {
        await API.put(`/threads/${editData._id}`, { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Forum post updated successfully!");
      } else {
        await API.post("/threads", { title, content }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Forum post created successfully!");
        setTitle("");
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save forum post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        {editData ? "✏️ Edit Forum Thread" : "📝 Create Forum Thread"}
      </h2>

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
        <div className="flex justify-end gap-4">
          <Button type="button" onClick={onCancel} styles="bg-gray-200">Cancel</Button>
          <Button type="submit" disabled={loading} styles="bg-green-500 text-white">
            {loading ? "Saving..." : editData ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateForumPost;
