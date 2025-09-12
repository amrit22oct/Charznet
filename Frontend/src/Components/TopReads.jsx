import React from "react";

const TopReads = ({ topReads = [] }) => {
  // Take only first 4 items safely
  const reads = topReads.slice(0, 4);

  return (
    <div className="bg-white shadow-lg rounded-[12px] p-5 w-[360px] h-[402px] flex flex-col">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-4 border-b border-gray-200 pb-2 flex-shrink-0">
        Top Reads
      </h1>

      {/* List */}
      <ul className="flex-1 flex flex-col justify-start space-y-2 overflow-y-auto">
        {reads.length > 0 ? (
          reads.map((thread, index) => (
            <li
              key={thread.id || index}
              className={`text-sm flex-shrink-0 ${
                index !== reads.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <p className="text-gray-700 truncate py-2">{thread.title}</p>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm italic py-2 flex-shrink-0">
            No top reads available
          </li>
        )}
      </ul>
    </div>
  );
};

export default TopReads;
