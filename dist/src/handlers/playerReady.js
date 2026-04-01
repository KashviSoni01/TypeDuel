import { rooms } from '../rooms/roomsStore.js';
import { texts } from '../game/text.js';
import { broadcastRoomStatus } from '../utils/broadcastRoomStatus.js';
export function handlePlayerReady(socket) {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) {
        return;
    }
    const room = rooms[roomId];
    room.players.forEach((player) => {
        if (player.socket === socket) {
            player.ready = true;
        }
    });
    console.log("Player ready in the room", roomId);
    // Broadcast status to everyone
    broadcastRoomStatus(roomId);
    if (room.players.length === 2) {
        const allReady = room.players.every((player) => player.ready === true);
        if (allReady) {
            const randomText = texts[Math.floor(Math.random() * texts.length)];
            room.text = randomText;
            room.gameStarted = true;
            room.winner = null;
            // Reset player game states
            room.players.forEach((p) => {
                p.finished = false;
                p.stats = null;
            });
            let countdown = 3;
            const interval = setInterval(() => {
                room.players.forEach((player) => {
                    player.socket.send(JSON.stringify({
                        type: "COUNTDOWN",
                        seconds: countdown
                    }));
                });
                countdown--;
                if (countdown === 0) {
                    clearInterval(interval);
                    room.gameStarted = true;
                    room.players.forEach((player) => {
                        player.socket.send(JSON.stringify({
                            type: "GAME_START",
                            text: randomText
                        }));
                    });
                }
            }, 1000);
        }
    }
}
export function handlePlayerNotReady(socket) {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) {
        return;
    }
    const room = rooms[roomId];
    room.players.forEach((player) => {
        if (player.socket === socket) {
            player.ready = false;
        }
    });
    console.log("Player not ready in the room", roomId);
    // Broadcast status to everyone
    broadcastRoomStatus(roomId);
}
//# sourceMappingURL=playerReady.js.map