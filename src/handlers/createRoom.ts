import { WebSocket } from "ws";
import { rooms } from '../rooms/roomsStore.js'
import { generateRoomId } from '../utils/generateRoomId.js';
import { broadcastRoomStatus } from '../utils/broadcastRoomStatus.js';

export function handleCreateRoom(socket: WebSocket) {
    const newRoom = generateRoomId();

    rooms[newRoom] = {
        players: []
    };

    rooms[newRoom].players.push({
        socket: socket,
        ready: false
    });
    //attaching the roomId directly to the socket
    (socket as any).roomId = newRoom
    socket.send(JSON.stringify({
        type: "ROOM_CREATED",
        roomId: newRoom
    }));

    // Broadcast initial room status
    broadcastRoomStatus(newRoom);

    console.log(rooms);
    setTimeout(() => {

        if (rooms[newRoom] && rooms[newRoom].players.length < 2) {

            delete rooms[newRoom]

            console.log(`Room ${newRoom} expired due to inactivity`)

        }

    }, 2 * 60 * 1000)

}