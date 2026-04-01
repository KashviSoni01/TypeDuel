import express from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";
import cors from "cors";

import { handleCreateRoom } from "./handlers/createRoom.js"
import { handleJoinRoom } from "./handlers/joinRoom.js";
import { handlePlayerReady, handlePlayerNotReady } from "./handlers/playerReady.js";
import { handleTypingProgress } from "./handlers/typingProgress.js";
import { handlePlayerFinished } from "./handlers/playerFinished.js";
import { handlePlayerDisconnect } from "./handlers/playerDisconnect.js";
import { handleGetRoomStatus } from "./handlers/getRoomStatus.js";
import { handleGetGameData } from "./handlers/getGameData.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });


app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);
app.use("/auth", authRoutes);

wss.on("connection", (socket: WebSocket) => {
    console.log("User connected");

    socket.on("message", (data) => {
        try {
            const message = JSON.parse(data.toString());

            console.log("Message received:", message.type);

            switch (message.type) {

                case "CREATE_ROOM":
                    handleCreateRoom(socket);
                    break;

                case "JOIN_ROOM":
                    handleJoinRoom(socket, message);
                    break;

                case "PLAYER_READY":
                    handlePlayerReady(socket);
                    break;

                case "PLAYER_NOT_READY":
                    handlePlayerNotReady(socket);
                    break;

                case "TYPING_PROGRESS":
                    handleTypingProgress(socket, message)
                    break;

                case "PLAYER_FINISHED":
                    handlePlayerFinished(socket, message)
                    break;

                case "GET_ROOM_STATUS":
                    handleGetRoomStatus(socket);
                    break;

                case "GET_GAME_DATA":
                    handleGetGameData(socket);
                    break;

                default:
                    console.log("Unknown message type:", message.type);
            }

        } catch (error) {
            console.log("Invalid message format");
        }
    });

    socket.on("close", () => {
        handlePlayerDisconnect(socket)
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});