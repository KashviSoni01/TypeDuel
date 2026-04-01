import { rooms } from "../rooms/roomsStore.js";
export function broadcastRoomStatus(roomId) {
    const room = rooms[roomId];
    if (!room)
        return;
    room.players.forEach((player) => {
        // Find the opponent (if any)
        const opponent = room.players.find((p) => p.socket !== player.socket);
        const statusMessage = JSON.stringify({
            type: "ROOM_STATUS",
            roomId,
            playerCount: room.players.length,
            opponentReady: opponent ? opponent.ready : false,
        });
        player.socket.send(statusMessage);
    });
}
//# sourceMappingURL=broadcastRoomStatus.js.map