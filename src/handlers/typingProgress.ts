import { WebSocket } from "ws";
import { rooms } from "../rooms/roomsStore.js";

export function handleTypingProgress(socket: WebSocket, message: any) {

  const roomId = (socket as any).roomId;

  if (!roomId) {
    console.log("Invalid Room Id");
    return;
  }

  const room = rooms[roomId];
  if(!room.gameStarted) {
    return;
  }
  
  if (!room) {
    console.log("Room not found");
    return;
  }

  room.players.forEach((player: any) => {

    if (player.socket !== socket) {

      player.socket.send(
        JSON.stringify({
          type: "OPPONENT_PROGRESS",
          progress: message.progress
        })
      );

    }

  });

}