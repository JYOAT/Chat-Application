import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";


dotenv.config();
const PORT = process.env.PORT;

const __dirname = path.resolve();


app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../Frontend/Frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend/Frontend", "dist", "index.html"));
    });
}
server.listen(PORT, () => {
    console.log("server is running on port 5001");
    connectDB();
});
