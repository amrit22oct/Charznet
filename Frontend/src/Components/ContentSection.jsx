import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import ContentEditor from "./ContentEditor";
import Api from "../api";

const ContentSection = ({ type, data, user, setData, view, users = [] }) => {
  const navigate = useNavigate();

  const handleEdit = (id) => navigate(`/create-posts/${type}/${id}`);
  const handleView = (id) => {
    const viewType = type === "threads" ? "forum" : type;
    navigate(`/${viewType}/${id}`);
  };

  const getAuthorName = (item) => {
    if (item.author && typeof item.author === "object") return item.author.name || "Unknown";
    if (typeof item.author === "string" && users.length) {
      const u = users.find((u) => u._id === item.author);
      if (u) return u.name;
    }
    if (item.author === user?._id) return user?.name || "Unknown";
    return "Unknown";
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await Api.delete(`/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Failed to delete content.");
    }
  };

  const canEdit = (item) =>
    user?.role === "superadmin" ||
    item.author === user?._id ||
    (typeof item.author === "object" && item.author._id === user?._id);

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500 mt-4">No {type} found.</p>;
  }

  if (view === "table") {
    const headerHeight = 48; // adjust for toolbar
    const sideBarWidth = 256; // 16rem

    return (
      <div className="relative w-full h-full">
        {/* Fixed header table */}
        <table
          className="fixed top-[135px] left-[16rem] w-[calc(100%-16rem)] border-collapse table-fixed bg-gray-200 z-30"
        >
          <thead>
            <tr>
              <th className="p-3 text-left font-semibold w-1/3 cursor-default">Title</th>
              <th className="p-3 text-center font-semibold w-1/3 cursor-default">Author</th>
              <th className="p-3 text-center font-semibold w-1/3 cursor-default">Actions</th>
            </tr>
          </thead>
        </table>

        {/* Scrollable table body */}
        <div
          className="overflow-auto scrollbar-hide"
          style={{
            maxHeight: `calc(100vh - 88px - 16px)`,
            marginTop: `${headerHeight}px`,
          }}
        >
          <table className="w-full border-collapse table-fixed text-sm">
            <tbody>
              {data.map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition cursor-default"
                >
                  <td className="p-3 w-1/3">{item.title || item.content?.slice(0, 30)}</td>
                  <td className="p-3 pl-5 text-center w-1/3">{getAuthorName(item)}</td>
                  <td className="p-3 pl-10  w-3/3 flex gap-3  justify-center">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleView(item._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer flex items-center gap-1"
                    >
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-full overflow-auto scrollbar-hide">
      {data.map((item) => (
        <ContentEditor
          key={item._id}
          item={item}
          canEdit={canEdit(item)}
          onDelete={() => handleDelete(item._id)}
          onEdit={() => handleEdit(item._id)}
          authorName={getAuthorName(item)}
          onView={() => handleView(item._id)}
        />
      ))}
    </div>
  );
};

export default ContentSection;
