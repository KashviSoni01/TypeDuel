import { rooms } from "../rooms/roomsStore.js";
export function handleGetGameData(socket) {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) {
        return;
    }
    const room = rooms[roomId];
    // If game has a text, send it to the player who requested it
    if (room.text) {
        socket.send(JSON.stringify({
            type: "GAME_DATA",
            text: room.text
        }));
    }
}
//# sourceMappingURL=getGameData.js.map