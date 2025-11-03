// src/socket/SocketInitializer.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../api/socket";
import { toast } from "react-toastify";
import { addMessage } from "../state/slices/messageSlice";
import {
  updateLatestMessage,
  incrementUnread,
} from "../state/slices/chatSlice";
import { setOnlineUsers } from "../state/slices/socketSlice";

const SocketInitializer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeChat } = useSelector((state) => state.chat);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    // authenticate before connecting
    socket.auth = { token: localStorage.getItem("token") };

    if (!socket.connected) socket.connect();

    /** --- HANDLERS --- */
    const handleConnect = () => {
      console.log("✅ Connected:", socket.id);
      socket.safeEmit("setup", user);
      toast.success(`Connected as ${user.name || user.email}`);
    };

    const handleMessage = (msg) => {
      const chatId = msg.chat?._id || msg.chatId;
      if (!chatId) return;

      dispatch(addMessage(msg));
      dispatch(updateLatestMessage({ chatId, message: msg }));

      if (!activeChat || activeChat._id !== chatId) {
        dispatch(incrementUnread(chatId));
      }
    };

    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users));
    };

    const handleAuthError = (message) => {
      console.error("Auth error:", message);
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("token");
      socket.disconnect();
    };

    const handleDisconnect = (reason) => {
      console.warn("🔴 Disconnected:", reason);
    };

    /** --- REGISTER --- */
    socket.on("connect", handleConnect);
    socket.on("message received", handleMessage);
    socket.on("online users", handleOnlineUsers);
    socket.on("auth error", handleAuthError);
    socket.on("disconnect", handleDisconnect);

    socket.io.on("reconnect", (attempt) => {
      console.log(`🟢 Reconnected after ${attempt} tries`);
      socket.safeEmit("setup", user);
      toast.info("Reconnected to chat server");
    });

    socket.io.on("reconnect_error", (err) => {
      console.error("Reconnect error:", err.message);
      toast.error("Reconnection failed, retrying...");
    });

    /** --- CLEANUP --- */
    return () => {
      socket.off("connect", handleConnect);
      socket.off("message received", handleMessage);
      socket.off("online users", handleOnlineUsers);
      socket.off("auth error", handleAuthError);
      socket.off("disconnect", handleDisconnect);
      socket.io.off("reconnect");
      socket.io.off("reconnect_error");
    };
  }, [user, activeChat, dispatch]);

  return null; // nothing to render
};

export default SocketInitializer;
