import { Server } from "socket.io";
import http from "http";
import express from "express";
import path from "path";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    }
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

// ✅ ADD THIS at the bottom of socket.js
if (process.env.NODE_ENV === "production") {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, "../../Frontend/Frontend/dist")));
    app.get("/:catchAll(*)", (req, res) => {
        res.sendFile(path.join(__dirname, "../../Frontend/Frontend/dist/index.html"));
    });
}
export { io, app, server };