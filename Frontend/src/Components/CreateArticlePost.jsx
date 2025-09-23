import React, { useState, useEffect } from "react";
import API from "../api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from "../Components/Buttons/Button";

const CreateArticlePost = ({ onCancel, editData }) => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(""); // optional
  const [image, setImage] = useState(null); // optional
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Prefill form if editing
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setTags(editData.tags || []);
      setCategory(editData.category?._id || editData.category || "");
      setContent(editData.content || "");
      setImage(null); // reset file input
    }
  }, [editData]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
   setMessage("");
 
   if (!title.trim() || !content.trim()) {
     setMessage("⚠️ Title and content are required");
     return;
   }
 
   setLoading(true);
   try {
     const formData = new FormData();
     formData.append("title", title.trim());
     formData.append("content", content.trim());
 
     // Only send category if it's a valid ObjectId
     if (category.trim() && /^[0-9a-fA-F]{24}$/.test(category.trim())) {
       formData.append("category", category.trim());
     }
 
     // Tags
     tags.forEach((tag) => {
       if (tag.trim()) formData.append("tags[]", tag.trim());
     });
 
     if (image) formData.append("image", image);
 
     const config = {
       headers: {
         Authorization: `Bearer ${token}`,
         "Content-Type": "multipart/form-data",
       },
     };
 
     if (editData?._id) {
       await API.put(`/articles/${editData._id}`, formData, config);
       setMessage("✅ Article updated successfully!");
     } else {
       await API.post("/articles", formData, config);
       setMessage("✅ Article created successfully!");
       setTitle("");
       setContent("");
       setTags([]);
       setCategory("");
       setImage(null);
     }
   } catch (err) {
     console.error(err.response?.data || err.message);
     setMessage(err.response?.data?.message || "❌ Failed to save article");
   } finally {
     setLoading(false);
   }
 };
 

  return (
    <div className="max-w-[900px] mx-auto p-6 bg-white rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {editData ? "✏️ Edit Article" : "✍️ Create Article"}
      </h2>

      {message && <p className="text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Title, Tags, Category */}
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
              placeholder="Tags (comma separated, optional)"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((t) => t.trim()))
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Category ID (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-3 rounded-lg"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center justify-start border p-4 rounded-lg bg-gray-50">
            <label className="text-sm text-gray-600 mb-2">
              Upload Thumbnail (optional)
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

export default CreateArticlePost;
