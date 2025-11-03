import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatBox from "./ChatBox.jsx";
import ChatSidebar from "./ChatSidebar.jsx";
import socket from "../api/socket.js";
import {
  fetchChats,
  setActiveChat,
  addChat,
  updateLatestMessage,
} from "../state/slices/chatSlice.js";
import {
  addMessage,
  getMessages,
  clearMessages,
} from "../state/slices/messageSlice.js";
import { getCurrentUser } from "../api/authApi.js";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { chats, activeChat, status } = useSelector((state) => state.chat);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  const activeChatRef = useRef(null);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  /* ============================================================
     🔹 Load user and fetch chats
     ============================================================ */
  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) return;
      setToken(storedToken);

      try {
        const currentUser = await getCurrentUser();

        // ✅ FIX: Extract user correctly
        const userData = currentUser?.user || currentUser;
        setUser(userData);
        console.log("✅ Logged in user:", userData?.name, userData?._id);

        dispatch(fetchChats());
      } catch (err) {
        console.error("❌ Error fetching user:", err);
      }
    };

    init();
  }, [dispatch]);

  /* ============================================================
     🔹 Socket Listeners
     ============================================================ */
  useEffect(() => {
    if (!user) return;

    console.log("🔌 Listening for socket events for:", user.name);

    const handleOnlineUsers = (users) => setOnlineUsers(users);
    const handleChatCreated = (newChat) => dispatch(addChat(newChat));

    const handleMessageReceived = (msg) => {
      const chatId = msg.chat?._id || msg.chatId;
      if (!chatId) return;

      dispatch(updateLatestMessage({ chatId, message: msg }));

      if (activeChatRef.current && activeChatRef.current._id === chatId) {
        dispatch(addMessage(msg));
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1,
        }));
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

  /* ============================================================
     🔹 Handle Chat Selection
     ============================================================ */
  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    dispatch(clearMessages());
    dispatch(getMessages(chat._id));
    setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }));
  };

  /* ============================================================
     🔹 Loading State
     ============================================================ */
  if (status === "loading" || !user) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-200">
        Loading chats...
      </div>
    );
  }

  /* ============================================================
     🔹 Render
     ============================================================ */
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ChatSidebar
        chats={chats}
        onSelectChat={handleSelectChat}
        activeChatId={activeChat?._id}
        user={user}
        unreadCounts={unreadCounts}
        onlineUsers={onlineUsers}
      />

      <div className="flex-1 flex flex-col">
        <ChatBox activeChat={activeChat} user={user} token={token} />
      </div>
    </div>
  );
};

export default ChatPage;
