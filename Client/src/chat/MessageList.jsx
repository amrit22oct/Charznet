import React from "react";

const MessageList = ({
  messages = [],
  user,
  expandedMessages,
  setExpandedMessages,
  onReply,
  messagesEndRef,
}) => {
  if (!user) return null;

  const toggleExpand = (id) => {
    setExpandedMessages((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => {
        const isSender = msg.senderId?._id === user._id;
        const expanded = expandedMessages.has(msg._id);

        return (
          <div
            key={msg._id}
            className={`flex ${
              isSender ? "justify-end" : "justify-start"
            } w-full`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                isSender
                  ? "bg-blue-600 text-white self-end"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              {/* 🔁 Reply Preview */}
              {msg.replyTo && (
                <div className="text-xs italic text-gray-300 dark:text-gray-400 border-l-2 border-gray-400 pl-2 mb-1">
                  Replying to: {msg.replyTo?.content || "message"}
                </div>
              )}

              {/* 💬 Message content */}
              <div
                onClick={() => toggleExpand(msg._id)}
                className={`cursor-pointer break-words ${
                  expanded ? "" : "line-clamp-3"
                }`}
              >
                {msg.content}
              </div>

              {/* 🕓 Timestamp */}
              <div
                className={`text-[11px] mt-1 ${
                  isSender ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
                } text-right`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* ↩️ Reply button */}
              <button
                onClick={() => onReply(msg)}
                className={`text-xs mt-1 ${
                  isSender
                    ? "text-blue-200 hover:text-white"
                    : "text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
                }`}
              >
                Reply
              </button>
            </div>
          </div>
        );
      })}

      {/* 👇 Auto-scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
