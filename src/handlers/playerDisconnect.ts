import { WebSocket } from "ws";
import { rooms } from "../rooms/roomsStore.js";
import { broadcastRoomStatus } from "../utils/broadcastRoomStatus.js";

// In playerDisconnect.ts
export function handlePlayerDisconnect(socket: WebSocket) {
  const roomId = (socket as any).roomId;
  
  if (!roomId || !rooms[roomId]) {
    return;
  }

  const room = rooms[roomId];
  
  // Remove the disconnected player
  room.players = room.players.filter((player: any) => player.socket !== socket);
  
  // Notify remaining players with updated status
  broadcastRoomStatus(roomId);

  // Send specific event for alerts
  room.players.forEach((player: any) => {
    player.socket.send(
      JSON.stringify({
        type: "OPPONENT_DISCONNECTED",
      })
    );
  });

  // Only delete if no players left
  if (room.players.length === 0) {
    delete rooms[roomId];
    console.log(`Room ${roomId} deleted (no players remaining)`);
  }
}