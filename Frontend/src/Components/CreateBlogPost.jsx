import React, { useState } from "react";
import API from "../api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "../Components/Buttons/Button";

const CreateBlogPost = ({ onCancel }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage("⚠️ Title and content are required");
      return;
    }
    if (!token) {
      setMessage("⚠️ You must be logged in to create a blog post");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("tags", tags);
      formData.append("summary", summary);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await API.post("/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Blog post created successfully!");
      setTitle("");
      setTags("");
      setSummary("");
      setImage(null);
      setContent("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">✍️ Create Blog Post</h2>
      {message && (
        <p
          className={`text-sm px-4 py-2 rounded-md ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : message.includes("❌") || message.includes("⚠️")
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Top section: Title + Tags | Image */}
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Left: Title + Tags */}
          <div className="flex-1 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Right: Image Upload */}
          <div className="flex flex-col items-center justify-start border border-dashed border-gray-300 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
            <label className="text-sm text-gray-600 mb-2">Upload Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-3 w-40 h-40 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* Summary */}
        <textarea
          placeholder="Write a short summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full h-24 resize-none focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />

        {/* Content */}
        <div className="border border-gray-200 rounded-lg p-2 shadow-sm">
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(event, editor) => setContent(editor.getData())}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button
            type="button"
            styles="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-lg px-6 py-2 shadow"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            styles="bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg px-6 py-2 shadow"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
