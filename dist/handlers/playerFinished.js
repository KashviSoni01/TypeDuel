import { rooms } from "../rooms/roomsStore.js";
export function handlePlayerFinished(socket, message) {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) {
        return;
    }
    const room = rooms[roomId];
    if (!room.gameStarted) {
        return;
    }
    // Find the player in the room
    const player = room.players.find((p) => p.socket === socket);
    if (!player || player.finished) {
        return;
    }
    // Store player stats
    player.finished = true;
    player.stats = {
        wpm: message.wpm,
        accuracy: message.accuracy,
        timeTaken: message.timeTaken
    };
    // Notify the other player
    const opponent = room.players.find((p) => p.socket !== socket);
    if (opponent && opponent.socket) {
        opponent.socket.send(JSON.stringify({
            type: "OPPONENT_FINISHED",
            wpm: message.wpm,
            accuracy: message.accuracy
        }));
    }
    // Check if all players are finished
    const allFinished = room.players.every((p) => p.finished);
    if (allFinished && room.players.length === 2) {
        const p1 = room.players[0];
        const p2 = room.players[1];
        // Determine winner based on Net WPM (highest wins, tie-break by accuracy, then timeTaken)
        let p1Wins = false;
        if (p1.stats.wpm > p2.stats.wpm) {
            p1Wins = true;
        }
        else if (p1.stats.wpm < p2.stats.wpm) {
            p1Wins = false;
        }
        else {
            // WPM Tie-break
            if (p1.stats.accuracy > p2.stats.accuracy) {
                p1Wins = true;
            }
            else if (p1.stats.accuracy < p2.stats.accuracy) {
                p1Wins = false;
            }
            else {
                // Accuracy Tie-break
                if (p1.stats.timeTaken <= p2.stats.timeTaken) {
                    p1Wins = true;
                }
                else {
                    p1Wins = false;
                }
            }
        }
        // Send results to both
        p1.socket.send(JSON.stringify({
            type: "GAME_RESULT",
            winner: p1Wins ? "you" : "opponent",
            yourWPM: p1.stats.wpm,
            opponentWPM: p2.stats.wpm,
            yourAccuracy: p1.stats.accuracy,
            opponentAccuracy: p2.stats.accuracy,
            timeTaken: p1.stats.timeTaken
        }));
        p2.socket.send(JSON.stringify({
            type: "GAME_RESULT",
            winner: !p1Wins ? "you" : "opponent",
            yourWPM: p2.stats.wpm,
            opponentWPM: p1.stats.wpm,
            yourAccuracy: p2.stats.accuracy,
            opponentAccuracy: p1.stats.accuracy,
            timeTaken: p2.stats.timeTaken
        }));
        // Reset room state after a delay or keep it for results?
        // We'll let them navigate back to lobby
    }
}
//# sourceMappingURL=playerFinished.js.map