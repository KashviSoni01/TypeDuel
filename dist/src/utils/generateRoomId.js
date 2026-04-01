import { rooms } from '../rooms/roomsStore.js';
export function generateRoomId() {
    let roomId;
    do {
        roomId = Math.random().toString(36).substring(2, 6);
    } while (rooms[roomId]);
    return roomId;
}
//# sourceMappingURL=generateRoomId.js.map