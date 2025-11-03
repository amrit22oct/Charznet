import React from "react";

const ChatSidebar = ({
  chats,
  onSelectChat,
  activeChatId,
  user,
  unreadCounts,
  onlineUsers,
}) => {
  if (!user) return <div className="p-4">Loading...</div>;

  console.log("🔍 Chats data:", chats);
  console.log("👤 Current user:", user);

  const renderChatName = (chat) => {
    // ✅ Group chat: show group name
    if (chat.isGroupChat) {
      return chat.chatName || "Unnamed Group";
    }

    // ✅ 1-to-1 chat: show receiver's name (not logged-in user)
    const otherUser = chat.users?.find((u) => u._id !== user._id);
    return otherUser?.name || "Unknown User";
  };

  return (
    <div className="w-1/3 md:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 text-xl font-semibold">
        Chats
      </div>

      {/* ✅ No chats */}
      {chats.length === 0 ? (
        <div className="p-4 text-gray-500 dark:text-gray-400 text-center">
          No chats yet
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const chatName = renderChatName(chat);
            const lastMessage = chat.latestMessage?.content || "No messages yet";

            const unreadCount = unreadCounts[chat._id] || 0;
            const isActive = activeChatId === chat._id;

            const otherUser = chat.users?.find((u) => u._id !== user._id);
            const isOnline = otherUser
              ? onlineUsers.includes(otherUser._id)
              : false;

            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {isOnline && (
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                    )}
                    <span className="font-medium">{chatName}</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {lastMessage}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
