import React from "react";

const ContentEditor = ({ item, canEdit, onEdit, onDelete, authorName }) => {
  return (
    <div className="border p-4 mb-2 rounded">
      <h3 className="font-bold mb-1">{item.title}</h3>
      <p className="text-gray-500 text-sm mb-2">By: {authorName}</p>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
      {canEdit && (
        <div className="mt-2 flex gap-2">
          <button onClick={onEdit} className="px-2 py-1 bg-yellow-400 rounded">
            Edit
          </button>
          <button onClick={onDelete} className="px-2 py-1 bg-red-500 rounded text-white">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
