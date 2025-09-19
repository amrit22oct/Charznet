import React from "react";

const ContentEditor = ({ item, canEdit, onEdit, onDelete, authorName, onView }) => {
  return (
    <div className="bg-white  rounded-lg shadow-sm hover:shadow-lg transition transform hover:scale-[1] flex flex-col p-4 max-h-[220px] min-h-[180px]">
      {/* Title fully visible */}
      <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.title}</h3>

      {/* Author */}
      <p className="text-gray-650 text-xs mb-1 truncate">By: {authorName}</p>

      {/* Content clipped without scroll */}
      <div
        className="text-gray-700 text-sm mb-2 overflow-hidden relative"
        style={{ maxHeight: "65px" }}
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto  justify-start">
        {onView && (
          <button
            onClick={onView}
            className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition text-sm font-medium"
          >
            View
          </button>
        )}
        {canEdit && (
          <>
            <button
              onClick={onEdit}
              className="px-2 py-1 bg-yellow-400 text-black rounded-md hover:bg-yellow-500 cursor-pointer  transition text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer  transition text-sm font-medium"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentEditor;
