import React from "react";
import ProfilePic from "../Components/ProfilePic";

const TopAuthors = ({ topAuthors = [] }) => {
  const authors = topAuthors.slice(0, 4);

  return (
    <div className="bg-white shadow-lg rounded-[12px] p-5 w-[360px] h-[383px] flex flex-col">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Top Authors</h2>
      <ul className="grid grid-rows-4 gap-3 flex-1">
        {authors.map((author, index) => (
          <li
            key={index}
            className="flex items-center gap-3 border-b last:border-none pb-2"
          >
            {/* Use a valid image URL or fallback */}
            <ProfilePic src={author?.avatar} name={author?.name} size="lg" rounded />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-700">{author.name || "Unknown"}</p>
              <p className="text-xs text-gray-500">
                Since: {author.joinedAt ? `${Math.floor((new Date() - new Date(author.joinedAt)) / (365*24*60*60*1000))} years ago` : "N/A"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopAuthors;
