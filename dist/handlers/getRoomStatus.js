import { rooms } from "../rooms/roomsStore.js";
import { broadcastRoomStatus } from "../utils/broadcastRoomStatus.js";
export function handleGetRoomStatus(socket) {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) {
        return;
    }
    // Just broadcast to this player only? 
    // No, we already have a helper that broadcasts to everyone.
    // Actually, broadcastRoomStatus sends to everyone.
    // It's safer to just send the status to everyone when anyone asks.
    broadcastRoomStatus(roomId);
}
//# sourceMappingURL=getRoomStatus.js.map