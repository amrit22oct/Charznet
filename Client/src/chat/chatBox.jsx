import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../api/socket";
import {
  getMessages,
  sendNewMessage,
  sendReplyMessage,
  addMessage,
} from "../state/slices/messageSlice";
import { updateChatLatestMessage as updateLatestMessage } from "../state/slices/chatSlice";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ReplyBar from "./ReplyBar";
import MessageInput from "./MessageInput";
import { toast } from "react-toastify";

const ChatBox = ({ activeChat, user }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);

  const [newMessage, setNewMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatId = activeChat?._id;

  useEffect(() => {
    if (!chatId) return;
    socket.emit("join chat", chatId);
    socket.off("message received");

    const handleIncoming = (msg) => {
      const incomingChatId = msg.chat?._id || msg.chatId;
      if (!incomingChatId || incomingChatId !== chatId) return;

      dispatch(addMessage(msg));
      dispatch(updateLatestMessage({ chatId, message: msg }));

      if (msg.senderId?._id !== user._id) {
        toast.info(` ${msg.senderId?.name || "New message"}`, {
          position: "bottom-right",
          autoClose: 1500,
        });
        new Audio("/notification.mp3").play().catch(() => {});
      }
    };

    socket.on("message received", handleIncoming);
    return () => {
      socket.emit("leave chat", chatId);
      socket.off("message received", handleIncoming);
    };
  }, [chatId, dispatch, user]);

  useEffect(() => {
    if (chatId) dispatch(getMessages(chatId));
  }, [dispatch, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSending || !newMessage.trim() || !chatId) return;
      setIsSending(true);

      try {
        const payload = replyingTo
          ? { chatId, content: newMessage.trim(), replyTo: replyingTo._id }
          : { chatId, content: newMessage.trim() };

        const action = replyingTo ? sendReplyMessage : sendNewMessage;
        const res = await dispatch(action(payload)).unwrap();

        // ✅ Correct key
        dispatch(updateLatestMessage({ chatId, message: res }));

        socket.emit("new message", {
          ...res,
          chat: activeChat && activeChat.users ? activeChat : { _id: chatId },
          senderId: user,
        });

        dispatch(addMessage(res));
        setNewMessage("");
        setReplyingTo(null);
      } catch (err) {
        console.error("❌ Error sending message:", err);
        toast.error("Failed to send message", { autoClose: 1500 });
      } finally {
        setIsSending(false);
      }
    },
    [dispatch, isSending, chatId, newMessage, replyingTo, activeChat, user]
  );

  const handleReplyClick = useCallback((msg) => setReplyingTo(msg), []);
  const cancelReply = useCallback(() => setReplyingTo(null), []);

  if (!activeChat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        💬 Select a chat to start messaging
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <ChatHeader activeChat={activeChat} user={user} />
      <MessageList
        messages={messages}
        user={user}
        expandedMessages={expandedMessages}
        setExpandedMessages={setExpandedMessages}
        onReply={handleReplyClick}
        messagesEndRef={messagesEndRef}
      />
      <ReplyBar replyingTo={replyingTo} cancelReply={cancelReply} />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        isSending={isSending}
      />
    </div>
  );
};

export default ChatBox;
