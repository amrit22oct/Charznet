import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "./ChatBox.jsx";
import ChatSidebar from "./ChatSidebar.jsx";
import socket from "../api/socket.js";
import {
  fetchChats,
  setActiveChat,
  addChat,
  updateChatLatestMessage as updateLatestMessage,
  incrementUnreadCount as incrementUnread,
} from "../state/slices/chatSlice.js";

import {
  addMessage,
  getMessages,
  clearMessages,
} from "../state/slices/messageSlice.js";
import { getCurrentUser } from "../api/authApi.js";
import { toast } from "react-toastify";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { chats, activeChat } = useSelector((state) => state.chat);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const activeChatRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    socket.emit("setup", user);
    socket.on("connected", () => console.log("✅ Socket connected for", user.name));
  }, [user]);
  
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // ===================================================
  // 🔹 Load user & chats on mount
  // ===================================================
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;
      setToken(storedToken);

      try {
        const res = await getCurrentUser();
        const currentUser = res.user || res;
        console.log("✅ Logged in user:", currentUser);
        setUser(currentUser);

        dispatch(fetchChats());
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };

    init();
  }, [dispatch]);

  // ===================================================
  // 🔹 Socket listeners (real-time events)
  // ===================================================
  useEffect(() => {
    if (!user) return;

    console.log("🔌 Listening for socket events for:", user.name || user.email);

    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const handleChatCreated = (newChat) => dispatch(addChat(newChat));

    const handleMessageReceived = (msg) => {
      const chatId = msg.chat?._id || msg.chatId;
      if (!chatId) return;

      // ✅ Update the latest message in Redux (sidebar)
      dispatch(updateLatestMessage({ chatId, message: msg }));

      // ✅ Store message globally (so ChatBox has it)
      dispatch(addMessage(msg));

      // ✅ If this chat isn’t open, mark it unread + show notification
      if (!activeChatRef.current || activeChatRef.current._id !== chatId) {
        dispatch(incrementUnread(chatId));

        // Optional: Toast / sound notification
        toast.info(`💬 New message from ${msg.senderId?.name || "someone"}`, {
          position: "bottom-right",
          autoClose: 2000,
        });

        new Audio("/notification.mp3").play().catch(() => {});
      }
    };

    socket.on("online users", handleOnlineUsers);
    socket.on("chat created", handleChatCreated);
    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("online users", handleOnlineUsers);
      socket.off("chat created", handleChatCreated);
      socket.off("message received", handleMessageReceived);
    };
  }, [user, dispatch]);

  // ===================================================
  // 🔹 When user selects a chat
  // ===================================================
  const handleSelectChat = (chat) => {
    // This will automatically reset unread in Redux
    dispatch(setActiveChat(chat));

    dispatch(clearMessages());
    dispatch(getMessages(chat._id));
  };

  // ===================================================
  // 🔹 Layout
  // ===================================================
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ChatSidebar
        onSelectChat={handleSelectChat}
        user={user}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col">
        <ChatBox activeChat={activeChat} user={user} token={token} />
      </div>
    </div>
  );
};

export default ChatPage;
