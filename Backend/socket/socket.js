// src/socket/socket.js (server)
import { Server } from "socket.io";

let io;

export const initSocket = (server, app) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*", // 🔸 change to your frontend origin in prod
        methods: ["GET", "POST"],
      },
      pingTimeout: 60000,
    });

    app.set("io", io);
    console.log("✅ Socket.io initialized successfully");

    io.on("connection", (socket) => {
      console.log(`🟢 New socket connected: ${socket.id}`);

      /** Helper to safely wrap socket events */
      const safeOn = (event, handler) => {
        socket.on(event, async (...args) => {
          try {
            await handler(...args);
          } catch (err) {
            console.error(`❌ Error in '${event}':`, err);
            socket.emit("error", { event, message: err.message });
          }
        });
      };

      /** 🧩 User setup: join personal room */
      safeOn("setup", (userData) => {
        if (!userData?._id) return;
        socket.join(userData._id.toString());
        socket.emit("connected");
        console.log(`👤 ${userData.name || "User"} joined room ${userData._id}`);
      });

      /** 💬 Join chat room */
      safeOn("join chat", (roomId) => {
        if (!roomId) return;
        socket.join(roomId);
        console.log(`💬 Socket ${socket.id} joined chat ${roomId}`);
      });

      /** 🚪 Leave chat */
      safeOn("leave chat", (roomId) => {
        if (!roomId) return;
        socket.leave(roomId);
        console.log(`🚪 Socket ${socket.id} left chat ${roomId}`);
      });

      /** 📨 New message handling */
      socket.on("new message", async (newMessage) => {
        try {
          if (!newMessage) return;
      
          const chat = newMessage.chat || newMessage.chatId;
          const chatId = chat?._id || chat;
          if (!chatId) return;
      
          console.log(`📤 New message in chat ${chatId}`);
      
          // 1️⃣ Emit to everyone in that chat (for those currently inside)
          io.to(chatId).emit("message received", newMessage);
      
          // 2️⃣ ALSO send to every chat participant's personal room
          const users = chat?.users || [];
          if (!users || users.length === 0) return;
      
          users.forEach((user) => {
            if (!user?._id) return;
            if (user._id === newMessage.senderId?._id) return; // don't notify the sender
            io.to(user._id.toString()).emit("message received", newMessage);
          });
        } catch (err) {
          console.error("Error broadcasting message:", err);
        }
      });
      

      /** 🔴 On disconnect */
      socket.on("disconnect", (reason) => {
        console.log(`🔴 Socket ${socket.id} disconnected (${reason})`);
      });

      socket.on("error", (err) => {
        console.error(`⚠️ Socket error from ${socket.id}:`, err.message);
      });
    });

    io.engine.on("connection_error", (err) => {
      console.error("🚨 Socket.io connection error:", err.message);
    });

  } catch (err) {
    console.error("❌ Failed to initialize Socket.io:", err.message);
  }
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized yet!");
  return io;
};
