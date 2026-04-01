import { rooms } from "../rooms/roomsStore.js";
export function handleTypingProgress(socket, message) {
    const roomId = socket.roomId;
    if (!roomId) {
        console.log("Invalid Room Id");
        return;
    }
    const room = rooms[roomId];
    if (!room.gameStarted) {
        return;
    }
    if (!room) {
        console.log("Room not found");
        return;
    }
    room.players.forEach((player) => {
        if (player.socket !== socket) {
            player.socket.send(JSON.stringify({
                type: "OPPONENT_PROGRESS",
                progress: message.progress
            }));
        }
    });
}
//# sourceMappingURL=typingProgress.js.map