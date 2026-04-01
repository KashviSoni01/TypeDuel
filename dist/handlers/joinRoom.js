import { rooms } from '../rooms/roomsStore.js';
import { broadcastRoomStatus } from '../utils/broadcastRoomStatus.js';
export function handleJoinRoom(socket, message) {
    const roomId = message.roomId?.toLowerCase();
    if (!roomId) {
        socket.send(JSON.stringify({
            type: "INVALID_ROOM_ID"
        }));
        return;
    }
    if (!rooms[roomId]) {
        socket.send(JSON.stringify({
            type: "ROOM_NOT_FOUND"
        }));
        return;
    }
    if (rooms[roomId].players.length >= 2) {
        socket.send(JSON.stringify({
            type: "ROOM_FULL"
        }));
        return;
    }
    rooms[roomId].players.push({
        socket: socket,
        ready: false
    });
    socket.roomId = roomId;
    console.log("Player joined room:", roomId);
    // Notify everyone with the latest status
    broadcastRoomStatus(roomId);
}
//# sourceMappingURL=joinRoom.js.map