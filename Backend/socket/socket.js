import { Server } from "socket.io";

let io;

export const initSocket = (server, app) => {
  try {
    io = new Server(server, {
      cors: {
        origin: "*", // ⚠️ Change to frontend URL in production
        methods: ["GET", "POST"],
      },
      pingTimeout: 60000,
    });

    app.set("io", io);
    console.log("✅ Socket.io initialized successfully");

    io.on("connection", (socket) => {
      console.log(`🟢 New connection established: ${socket.id}`);

      // ✅ Safe event wrapper
      const safeOn = (event, handler) => {
        socket.on(event, async (...args) => {
          try {
            await handler(...args);
          } catch (err) {
            console.error(`❌ Error in event '${event}':`, err.message);
            socket.emit("error", { event, message: err.message });
          }
        });
      };

      // 🧩 Setup personal room
      safeOn("setup", (userData) => {
        if (!userData || !userData._id) {
          console.warn("⚠️ 'setup' event missing userData._id");
          socket.emit("error", { event: "setup", message: "Invalid user data" });
          return;
        }
        socket.join(userData._id);
        socket.emit("connected");
        console.log(`👤 ${userData.name || "Unknown"} joined personal room ${userData._id}`);
      });

      // 💬 Join chat room
      safeOn("join chat", (roomId) => {
        if (!roomId) {
          socket.emit("error", { event: "join chat", message: "Missing room ID" });
          return;
        }
        socket.join(roomId);
        console.log(`💬 ${socket.id} joined chat room ${roomId}`);
      });

      // 🚪 Leave chat room
      safeOn("leave chat", (roomId) => {
        if (!roomId) {
          socket.emit("error", { event: "leave chat", message: "Missing room ID" });
          return;
        }
        socket.leave(roomId);
        console.log(`🚪 ${socket.id} left chat room ${roomId}`);
      });

      // 📨 New message broadcast
      safeOn("new message", (newMessage) => {
        if (!newMessage) {
          socket.emit("error", { event: "new message", message: "Missing message data" });
          return;
        }

        const chat = newMessage.chat || newMessage.chatId;
        const chatId = chat?._id || chat;

        if (!chatId) {
          console.warn("⚠️ 'new message' missing chat._id");
          socket.emit("error", { event: "new message", message: "Invalid chat data" });
          return;
        }

        console.log(`📤 Broadcasting message to chat ${chatId}`);
        io.to(chatId).emit("message received", newMessage);
      });

      // 🔴 Handle disconnect
      socket.on("disconnect", (reason) => {
        console.log(`🔴 ${socket.id} disconnected (${reason})`);
      });

      // 🧨 Catch all errors for this socket
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
