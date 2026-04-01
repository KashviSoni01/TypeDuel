import { rooms } from "../rooms/roomsStore.js";

export function broadcastRoomStatus(roomId: string) {
  const room = rooms[roomId];
  if (!room) return;

  room.players.forEach((player: any) => {
    // Find the opponent (if any)
    const opponent = room.players.find((p: any) => p.socket !== player.socket);

    const statusMessage = JSON.stringify({
      type: "ROOM_STATUS",
      roomId,
      playerCount: room.players.length,
      opponentReady: opponent ? opponent.ready : false,
    });

    player.socket.send(statusMessage);
  });
}
