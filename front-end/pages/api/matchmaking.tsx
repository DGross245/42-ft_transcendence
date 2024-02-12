import { DefaultEventsMap } from '@socket.io/component-emitter';
import { RemoteSocket } from 'Socket.IO';
import { DecorateAcknowledgementsWithMultipleResponses } from 'Socket.IO/dist/typed-events';
import crypto from 'crypto';

// TODO: Add a timer or something for the case where a match is found but the opponent never joints because of quit

interface Matchmaking {
	sockets: RemoteSocket<DecorateAcknowledgementsWithMultipleResponses<DefaultEventsMap>, any>[],
	gameType: string,
}

const searchForOpponent = (sockets :Matchmaking['sockets'], gameType: string, maxClients: number) => {
	const maxDiff = 0.3;

	for (let i = 0; i < sockets.length; i++) {
		let sequence = [sockets[i]];
		let maxDifference = sockets[i].data.elo * maxDiff;

		for (let j = i + 1; j < sockets.length; j++) {
			if (Math.abs(sockets[j].data.elo - sequence[sequence.length - 1].data.elo) <= maxDifference)
				sequence.push(sockets[j]);
			if (sequence.length === length)
				return (sequence);
		}
	}
	return ([]);
}

export const matchmaking = ({sockets, gameType} : Matchmaking) => {
	var players : Matchmaking['sockets'] = [];
	let maxClients = 2;

	if (gameType === "OneForAll")
		maxClients = 4;
	else if (gameType === "Qubic")
		maxClients = 3;

	if (sockets.length >= maxClients) {
		players = searchForOpponent(sockets, gameType, maxClients);

		if (players.length > 0) {
			var id = crypto.randomBytes(20).toString('hex').substring(0, 7);

			for (let i = 0; i < maxClients; i++) {
				players[i].emit('match-found', id);
				players[i].leave(gameType);
			}
		}
	}

	return (null)
}