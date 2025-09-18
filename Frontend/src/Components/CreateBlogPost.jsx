import React, { useState, useEffect } from "react";
import API from "../api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "../Components/Buttons/Button";

const CreateBlogPost = ({ onCancel, editData }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setTags(editData.tags?.join(", ") || "");
      setSummary(editData.summary || "");
      setContent(editData.content || "");
      setImage(null); // reset to null; use preview from editData.image
    }
  }, [editData]);

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
      setMessage("⚠️ You must be logged in");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((t) => t.trim()))
      );
      formData.append("summary", summary);
      formData.append("content", content);

      if (image) formData.append("image", image);

      if (editData?._id) {
        // Update existing blog
        await API.put(`/blogs/${editData._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Blog post updated successfully!");
      } else {
        // Create new blog
        await API.post("/blogs", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Blog post created successfully!");
        setTitle("");
        setTags("");
        setSummary("");
        setImage(null);
        setContent("");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to save blog post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {editData ? "✏️ Edit Blog Post" : "✍️ Create Blog Post"}
      </h2>

      {message && <p className="text-sm">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title + Tags */}
        <div className="flex gap-6 flex-col md:flex-row">
          <div className="flex-1 flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 rounded-lg"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="border p-3 rounded-lg"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center justify-start border p-4 rounded-lg bg-gray-50">
            <label className="text-sm text-gray-600 mb-2">
              Upload Thumbnail
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                className="mt-3 w-40 h-40 object-cover rounded-lg shadow"
              />
            ) : editData?.image ? (
              <img
                src={editData.image}
                className="mt-3 w-40 h-40 object-cover rounded-lg shadow"
              />
            ) : null}
          </div>
        </div>

        {/* Summary */}
        <textarea
          placeholder="Write a short summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border p-3 rounded-lg w-full h-24 resize-none"
        />

        {/* Content */}
        <div className="border rounded-lg p-2 shadow-sm">
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={(e, editor) => setContent(editor.getData())}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <Button type="button" onClick={onCancel} styles="bg-gray-200">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            styles="bg-indigo-500 text-white"
          >
            {loading ? "Saving..." : editData ? "Update" : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
