import React from "react";
import { useNavigate } from "react-router-dom";
import ContentEditor from "./ContentEditor";
import Api from "../api"; // your API instance

const ContentSection = ({ type, data, user, setData, view, users = [] }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/create-posts/${type}/${id}`);
  };

  const getAuthorName = (item) => {
    // Case 1: backend populated author object
    if (typeof item.author === "object" && item.author?.name) {
      return item.author.name;
    }

    // Case 2: superadmin looking up by author id
    if (user?.role === "superadmin" && users.length && typeof item.author === "string") {
      const u = users.find((u) => u._id === item.author);
      if (u) return u.name;
    }

    // Case 3: current user is the author
    if (item.author === user?._id) {
      return user?.name || "Unknown";
    }

    return "Unknown";
  };

  // DELETE API call
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await Api.delete(`/content/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from local state after successful deletion
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete content.");
    }
  };

  // Check if current user can edit/delete this item
  const canEdit = (item) =>
    user?.role === "superadmin" ||
    item.author === user?._id ||
    (typeof item.author === "object" && item.author._id === user?._id);

  if (!data.length) return <p className="text-gray-500">No {type} found.</p>;

  return (
    <>
      {(user?.role === "author" || user?.role === "superadmin") && (
        <button
          onClick={() => navigate(`/create-posts/${type}`)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Create {type}
        </button>
      )}

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((item) => (
            <ContentEditor
              key={item._id}
              item={item}
              canEdit={canEdit(item)}
              onDelete={() => handleDelete(item._id)}
              onEdit={() => handleEdit(item._id)}
              authorName={getAuthorName(item)}
            />
          ))}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2 text-left">Author</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="border p-2">
                  {item.title || item.content?.slice(0, 50)}
                </td>
                <td className="border p-2">{getAuthorName(item)}</td>
                <td className="border p-2 flex gap-2">
                  {canEdit(item) && (
                    <>
                      <button
                        onClick={() => handleEdit(item._id)}
                        className="px-2 py-1 bg-yellow-400 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ContentSection;
