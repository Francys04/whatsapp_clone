// express: Framework for building web applications.
// dotenv: Loads environment variables from a .env file.
// cors: Enables cross-origin resource sharing (CORS) for handling requests from different origins.
// AuthRoutes: Imported routes for handling authentication logic.
// MessageRoutes: Imported routes for handling message-related operations.
// Server: Class from socket.io

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";

// loads environment variables from the .env file (likely containing the server port).
dotenv.config();

// app: Creates an Express application instance.
// cors(): Enables CORS with default settings (allowing all origins).
// app.use(express.json()): Parses incoming JSON request bodies.
// Static File Serving:
// Makes the uploads/recordings and uploads/images directories publicly accessible for serving audio and image files.
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images/", express.static("uploads/images"));

app.use("/api/auth/", AuthRoutes);
app.use("/api/messages", MessageRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
});

// "add-user": Captures the user ID upon connection, adds the user to the onlineUsers map, and broadcasts the online user list to all connected clients.
// "signout": Removes the user from the onlineUsers map and broadcasts the updated online user list.
// "outgoing-voice-call": Attempts to find the recipient's socket ID, emits an "incoming-voice-call" event to the recipient if online, otherwise emits a "voice-call-offline" event to the sender.
// "reject-voice-call": Finds the caller's socket ID and emits a "voice-call-rejected" event to them.
// "outgoing-video-call": Similar to "outgoing-voice-call" but emits an "incoming-video-call" event.
// "accept-incoming-call": Finds the caller's socket ID and emits an "accept-call" event to them.
// "reject-video-call": Similar to "reject-voice-call" but emits a "video-call-rejected" event.
// "send-msg": Finds the recipient's socket ID and emits an "msg-recieve" event with message details.
// "mark-read": Finds the recipient's socket ID and emits a "mark-read-recieve" event containing message and sender information.

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });

  socket.on("signout", (id) => {
    onlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });

  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    } else {
      const senderSocket = onlineUsers.get(data.from);
      socket.to(senderSocket).emit("voice-call-offline");
    }
  });

  socket.on("reject-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  });

  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from: data.from,
        roomId: data.roomId,
        callType: data.callType,
      });
    } else {
      const senderSocket = onlineUsers.get(data.from);
      socket.to(senderSocket).emit("video-call-offline");
    }
  });

  socket.on("accept-incoming-call", ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    socket.to(sendUserSocket).emit("accept-call");
  });

  socket.on("reject-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected");
    }
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket
        .to(sendUserSocket)
        .emit("msg-recieve", { from: data.from, message: data.message });
    }
  });

  socket.on("mark-read", ({ id, recieverId }) => {
    const sendUserSocket = onlineUsers.get(id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("mark-read-recieve", { id, recieverId });
    }
  });
});
